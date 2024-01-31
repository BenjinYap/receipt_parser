import {ParsedExpense} from "./ReceiptApiInterface.ts";

type DataShape = {
  blocks: Array<ParsedExpense>,
};

export default class UploadReceiptSuccessResponse {
  constructor(
    public data: DataShape,
  ) {
  }
}