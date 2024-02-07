import ApiErrorResponse from "../../../Global/Api/ApiErrorResponse";
import UploadReceiptSuccessResponse from "./UploadReceiptSuccessResponse";

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