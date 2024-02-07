import {ParsedExpense} from "./ReceiptApiInterface";

type DataShape = {
  blocks: Array<ParsedExpense>,
};

export default class UploadReceiptSuccessResponse {
  constructor(
    public data: DataShape,
  ) {
  }
}