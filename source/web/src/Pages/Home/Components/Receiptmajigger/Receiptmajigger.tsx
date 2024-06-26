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
    {id: 2, name: 'Eating out', color: 'green'},
    {id: 3, name: 'Groceries', color: 'blue'},
    {id: 1, name: 'Snacks', color: 'red'},
    {id: 7, name: 'Drinks for home', color: 'pink'},
    {id: 6, name: 'Drinks to go', color: 'orange'},
    {id: 8, name: 'Coffee shop', color: 'violet'},
    {id: 4, name: 'Gifts', color: 'grape'},
    {id: 5, name: 'Cleaning Supplies', color: 'yellow'},
    // {id: 9, name: 'Cleaning Supplies', color: 'indigo'},
    // {id: 10, name: 'Cleaning Supplies', color: 'cyan'},
    // {id: 11, name: 'Cleaning Supplies', color: 'teal'},
    // {id: 12, name: 'Cleaning Supplies', color: 'lime'},
  ];

  const [takePhotoModalOpen, takePhotoModalOpenHandlers] = useDisclosure(false);
  const [activeExpenseCategoryId, setActiveExpenseCategoryId] = useState<number | null>(null);
  const [expenseCategories, expenseCategoriesHandler] = useListState<ExpenseCategory>(DEFAULT_EXPENSE_CATEGORIES);
  const [uploadedImages, uploadedImagesHandler] = useListState<UploadedImage>([]);
  const previousUploadedImages = usePrevious(uploadedImages);
  const [parsedExpenses, parsedExpensesHandler] = useListState<ParsedExpense>([]);  //all parsed expenses across all images
  //key is the string id for the overlay from textract, number is the assigned category id
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
        amount: Number((categorySummaryMap[category.id].amount + Number(expense.text.replace('$', ''))).toFixed(2)),
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

  const handleParsedExpenseClear = (id: string) => {
    const copy = {...trackedExpenses};
    delete copy[id];
    setTrackedExpenses(copy);
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

  const handleThumbnailDeleteClick = (id: string) => {
    const index: number = uploadedImages.findIndex((image: UploadedImage) => image.id === id);

    //delete the image if it exists
    if (index > -1) {
      const image: UploadedImage = uploadedImages[index];
      const imgExpenseIdMap: Record<string, boolean> = {};

      //make a map of the image's expense ids so we can use it to delete it from the global list
      for (const expense of image.parsedExpenses) {
        imgExpenseIdMap[expense.id] = true;
      }

      const toRemove: Array<number> = [];

      //find all the expenses that need to be removed from the global list
      for (let i = 0; i < parsedExpenses.length; i++) {
        if (parsedExpenses[i].id in imgExpenseIdMap) {
          toRemove.push(i);
        }
      }

      //remove the global expenses and the image itself
      parsedExpensesHandler.remove(...toRemove);
      uploadedImagesHandler.remove(index);
    }
  };

  useEffect(() => {
    if (previousUploadedImages) {
      //if we added more images, make the latest one active
      if (uploadedImages.length > previousUploadedImages.length) {
        updateActiveImage(uploadedImages.length - 1);
      } else if (uploadedImages.length < previousUploadedImages.length) {
        //if we removed images and the active one got removed, make the last one active
        if (uploadedImages.find((a: UploadedImage) => a.isActive) === undefined) {
          updateActiveImage(uploadedImages.length - 1);
        }
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
          onParsedExpenseClear={(id: string) => handleParsedExpenseClear(id)}
          trackedExpenses={trackedExpenses}
        />
        <ImageThumbnailList
          images={uploadedImages}
          onDrop={handleDrop}
          onThumbnailClick={handleThumbnailClick}
          onCameraClick={() => takePhotoModalOpenHandlers.open()}
          onThumbnailDeleteClick={handleThumbnailDeleteClick}
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