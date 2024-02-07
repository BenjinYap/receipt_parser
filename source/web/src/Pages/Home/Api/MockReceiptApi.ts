import Api from "../../../Global/Api/Api";
import ReceiptApiInterface from "./ReceiptApiInterface";
import UploadReceiptSuccessResponse from "./UploadReceiptSuccessResponse";
import ApiErrorResponse from "../../../Global/Api/ApiErrorResponse";

const API_HOST = import.meta.env.VITE_API_HOST;

export default class MockReceiptApi extends Api implements ReceiptApiInterface {

  public async uploadReceipt(file: File): Promise<any> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const resp = await this.post(`${API_HOST}/api/receipt_parse?mock=1`, {}, JSON.stringify({file: reader.result}));
        const json = await resp.json();

        if (resp.status === 200) {
          resolve(new UploadReceiptSuccessResponse(json));
        } else {
          resolve(new ApiErrorResponse(json.code, json.errorData));
        }
      };
    });
  }
}