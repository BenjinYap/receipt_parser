import {ErrorResponse} from "../../../Global/Api/Api.ts";

export type ParsedExpense = {
  id: string,
  left: number,
  top: number,
  width: number,
  height: number,
  text: string,
};

export type UploadReceiptSuccessResponse = {
  success: boolean,
  data: {
    blocks: Array<ParsedExpense>,
  },
};

export default interface ReceiptApiInterface {
  uploadReceipt: (file: File) => Promise<UploadReceiptSuccessResponse | ErrorResponse>;
}