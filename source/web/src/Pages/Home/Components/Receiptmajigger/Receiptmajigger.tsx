import ImageViewer from "./ImageViewer";
import {useDisclosure, useListState, usePrevious} from "@mantine/hooks";
import {useEffect, useState} from "react";
import MockReceiptApi from "../../Api/MockReceiptApi";
import {Flex, Stack} from "@mantine/core";
import ImageThumbnailList from "./ImageThumbnailList";
import BrushSelector from "./BrushSelector";
import ExpenseSummary, {ExpenseSummaryDataRow} from "./ExpenseSummary";
import {ParsedExpense} from "../../Api/ReceiptApiInterface";
import {notifications} from "@mantine/notifications";
import TakePhotoModal from "./TakePhotoModal";
import UploadReceiptSuccessResponse from "../../Api/UploadReceiptSuccessResponse";
import ApiErrorResponse from "../../../../Global/Api/ApiErrorResponse";

const receiptApi = new MockReceiptApi();

export type UploadedImage = {
  id: string,
  isActive: boolean,
  previewUrl: string,
  textracting: boolean,
  textractData: any,
  parsedExpenses: Array<ParsedExpense>,
};

export type ExpenseCategory = {
  id: number,
  name: string,
  color: string,
};

const Receiptmajigger = () => {
  const DEFAULT_EXPENSE_CATEGORIES = [
    {id: 3, name: 'Groceries', color: 'blue'},
    {id: 2, name: 'Eating out', color: 'green'},
    {id: 1, name: 'Snacks', color: 'red'},
    {id: 6, name: 'Drinks', color: 'orange'},
    {id: 4, name: 'Gifts', color: 'grape'},
    {id: 5, name: 'Cleaning Supplies', color: 'yellow'},
  ];

  const [takePhotoModalOpen, takePhotoModalOpenHandlers] = useDisclosure(false);
  const [activeExpenseCategoryId, setActiveExpenseCategoryId] = useState<number | null>(null);
  const [expenseCategories, expenseCategoriesHandler] = useListState<ExpenseCategory>(DEFAULT_EXPENSE_CATEGORIES);
  const [uploadedImages, uploadedImagesHandler] = useListState<UploadedImage>([]);
  const previousUploadedImages = usePrevious(uploadedImages);
  const [parsedExpenses, parsedExpensesHandler] = useListState<ParsedExpense>([]);  //all parsed expenses across all images
  const [trackedExpenses, setTrackedExpenses] = useState<Record<string, number>>({});  //all tracked expenses across all images

  //todo this is a stupid hack to stop typescript from complaining about expenseCategoriesHandler not being used
  if (DEFAULT_EXPENSE_CATEGORIES.length === 1) {
    console.log(expenseCategoriesHandler)
  }

  const summarizeTrackedExpenses = (): Array<ExpenseSummaryDataRow> => {
    const categorySummaryMap: Record<number, { categoryName: string, amount: number }> = {};

    for (const expenseId in trackedExpenses) {
      const expense = parsedExpenses.find((a: ParsedExpense) => a.id === expenseId);
      const category = expenseCategories.find((a: ExpenseCategory) => a.id === trackedExpenses[expenseId]);

      //somehow doesn't match an expense or category, ignore this
      if (expense === undefined || category === undefined) {
        continue;
      }

      // noinspection PointlessBooleanExpressionJS
      if (category.id in categorySummaryMap === false) {
        categorySummaryMap[category.id] = {
          categoryName: category.name,
          amount: 0,
        };
      }

      categorySummaryMap[category.id] = {
        ...categorySummaryMap[category.id],
        amount: categorySummaryMap[category.id].amount + Number(expense.text.replace('$', '')),
      };
    }

    const data: Array<ExpenseSummaryDataRow> = [];

    for (const categoryId in categorySummaryMap) {
      data.push({
        categoryId: Number(categoryId),
        categoryName: categorySummaryMap[categoryId].categoryName,
        amount: Number(categorySummaryMap[categoryId].amount),
      });
    }

    return data;
  };

  const handleParsedExpenseSelect = (id: string) => {
    //don't do anything if no brush is selected
    if (activeExpenseCategoryId === null) {
      notifications.show({
        color: 'red',
        message: 'Select a category brush before painting.',
      });
      return;
    }

    //if already tracked with the same category brush, then remove
    if (id in trackedExpenses && trackedExpenses[id] === activeExpenseCategoryId) {
      const copy = {...trackedExpenses};
      delete copy[id];
      setTrackedExpenses(copy);
    } else {  //otherwise track it
      setTrackedExpenses({
        ...trackedExpenses,
        [id]: activeExpenseCategoryId,
      });
    }
  };

  const updateActiveImage = (activeIndex: number): void => {
    //set the currently active one to false and the new index to true
    //this should only result in 2 state calls which should be better than doing a one liner
    for (let i: number = 0; i < uploadedImages.length; i++) {
      if (uploadedImages[i].isActive && i !== activeIndex) {
        uploadedImagesHandler.setItemProp(i, 'isActive', false);
      } else if (i === activeIndex) {
        uploadedImagesHandler.setItemProp(i, 'isActive', true);
      }
    }
  };

  const handleDrop = (files: Array<File>) => {
    const toAdd: Array<UploadedImage> = [];
    const currentImageCount = uploadedImages.length;

    for (let i: number = 0; i < files.length; i++) {
      toAdd.push({
        //todo should add duplicate id check
        id: Math.random().toFixed(20).replace('0.', ''),
        isActive: false,
        previewUrl: URL.createObjectURL(files[i]),
        textracting: true,
        textractData: undefined,
        parsedExpenses: [],
      });

      //upload the image to the OCR api then save the resulting data
      receiptApi.uploadReceipt(files[i]).then((resp: UploadReceiptSuccessResponse | ApiErrorResponse) => {
        uploadedImagesHandler.setItemProp(i + currentImageCount, 'textracting', false);

        if (resp instanceof UploadReceiptSuccessResponse) {
          // const successResp: UploadReceiptSuccessResponse = resp as UploadReceiptSuccessResponse;
          //save the data to this image specifically
          uploadedImagesHandler.setItemProp(i + currentImageCount, 'textractData', resp.data);
          uploadedImagesHandler.setItemProp(i + currentImageCount, 'parsedExpenses', resp.data.blocks);
          //add the parsed expenses to the global list of parsed expenses
          parsedExpensesHandler.append(...resp.data.blocks);
        }
      });
    }

    //set all existing images to inactive
    uploadedImagesHandler.apply((image: UploadedImage) => {
      image.isActive = false;
      return image;
    });
    //set the first of the newly uploaded image to be active
    toAdd[0].isActive = true;
    uploadedImagesHandler.append(...toAdd);
  };

  const handleWebcamPhotoUpload = async (base64: string) => {
    takePhotoModalOpenHandlers.close();
    //fancy thing to convert the base64 into a File
    const resp = await fetch(base64);
    const resp2 = await resp.blob();
    const file = new File([resp2], "File name", {type: "image/png"});
    handleDrop([file]);
  };

  const handleThumbnailClick = (id: string) => {
    updateActiveImage(uploadedImages.findIndex((image: UploadedImage) => image.id === id));
  };

  useEffect(() => {
    if (previousUploadedImages) {
      if (uploadedImages.length > previousUploadedImages.length) {
        updateActiveImage(uploadedImages.length - 1);
      } else if (uploadedImages.length < previousUploadedImages.length) {
        //todo deal with deleting images later
      }
    }
  }, [uploadedImages, previousUploadedImages, updateActiveImage]);

  return (
    <>
      <Flex
        w="100%"
        gap="xs"
        direction={{base: 'column', xs: 'row'}}
      >
        <ImageViewer
          images={uploadedImages}
          onDelete={() => console.log(1)}
          onParsedExpenseSelect={(id: string) => handleParsedExpenseSelect(id)}
          trackedExpenses={trackedExpenses}
        />
        <ImageThumbnailList
          images={uploadedImages}
          onDrop={handleDrop}
          onThumbnailClick={handleThumbnailClick}
          onCameraClick={() => takePhotoModalOpenHandlers.open()}
        />
        <Stack>
          <BrushSelector
            categories={expenseCategories}
            onCategorySelect={(id: number) => setActiveExpenseCategoryId(id)}
            activeCategoryId={activeExpenseCategoryId}
          />
          <ExpenseSummary
            data={summarizeTrackedExpenses()}
          />
        </Stack>
      </Flex>
      {takePhotoModalOpen &&
        <TakePhotoModal
          opened={takePhotoModalOpen}
          onClose={() => takePhotoModalOpenHandlers.close()}
          onUpload={handleWebcamPhotoUpload}
        />
      }
    </>
  );
};

export default Receiptmajigger;