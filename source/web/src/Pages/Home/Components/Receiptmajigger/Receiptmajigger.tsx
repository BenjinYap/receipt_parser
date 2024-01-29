import ImageViewer from "./ImageViewer.tsx";
import {useListState, usePrevious} from "@mantine/hooks";
import {useEffect, useState} from "react";
import MockReceiptApi from "../../Api/MockReceiptApi.ts";
import {Flex, Stack} from "@mantine/core";
import ImageThumbnailList from "./ImageThumbnailList.tsx";
import BrushSelector from "./BrushSelector.tsx";
import ExpenseSummary, {ExpenseSummaryDataRow} from "./ExpenseSummary.tsx";
import {ParsedExpense, UploadReceiptSuccessResponse} from "../../Api/ReceiptApiInterface.ts";
import {ErrorResponse} from "../../../../Global/Api/Api.ts";

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
    {id: 1, name: 'Snacks', color: 'red'},
    {id: 2, name: 'Eating out', color: 'green'},
    {id: 3, name: 'Groceries', color: 'blue'},
  ];

  const [activeExpenseCategoryId, setActiveExpenseCategoryId] = useState<number | null>(null);
  const [expenseCategories, expenseCategoriesHandler] = useListState<ExpenseCategory>(DEFAULT_EXPENSE_CATEGORIES);
  const [uploadedImages, uploadedImagesHandler] = useListState<UploadedImage>([]);
  const previousUploadedImages = usePrevious(uploadedImages);
  const [parsedExpenses, parsedExpensesHandler] = useListState<ParsedExpense>([]);  //all parsed expenses across all images
  const [trackedExpenses, setTrackedExpenses] = useState<Record<string, number>>({});  //all tracked expenses across all images

  const summarizeTrackedExpenses = (): Array<ExpenseSummaryDataRow> => {
    const categorySummaryMap: Record<string, number> = {};

    for (const expenseId in trackedExpenses) {
      const expense = parsedExpenses.find((a: ParsedExpense) => a.id === expenseId);
      const category = expenseCategories.find((a: ExpenseCategory) => a.id === trackedExpenses[expenseId]);

      //somehow doesn't match an expense or category, ignore this
      if (expense === undefined || category === undefined) {
        continue;
      }

      // noinspection PointlessBooleanExpressionJS
      if (category.name in categorySummaryMap === false) {
        categorySummaryMap[category.name] = 0;
      }

      categorySummaryMap[category.name] += Number(expense.text.replace('$', ''));
    }

    const data: Array<ExpenseSummaryDataRow> = [];

    for (const category in categorySummaryMap) {
      data.push([category, categorySummaryMap[category].toFixed(2)]);
    }

    return data;
  };

  const handleParsedExpenseSelect = (id: string) => {
    //don't do anything if no brush is selected
    if (activeExpenseCategoryId === null) {
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
      receiptApi.uploadReceipt(files[i]).then((resp: UploadReceiptSuccessResponse | ErrorResponse) => {
        uploadedImagesHandler.setItemProp(i + currentImageCount, 'textracting', false);

        if (resp.success) {
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
  }, [uploadedImages]);

  return (
    <>
      <Flex
        w="100%"
        gap="md"
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
    </>
  );
};

export default Receiptmajigger;