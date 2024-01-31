import ApiErrorResponse from "../../../Global/Api/ApiErrorResponse.ts";
import UploadReceiptSuccessResponse from "./UploadReceiptSuccessResponse.ts";

export type ParsedExpense = {
  id: string,
  left: number,
  top: number,
  width: number,
  height: number,
  text: string,
};

export default interface ReceiptApiInterface {
  uploadReceipt: (file: File) => Promise<UploadReceiptSuccessResponse | ApiErrorResponse>;
}