import Api from "../../../Global/Api/Api.ts";
import ReceiptApiInterface from "./ReceiptApiInterface.ts";

export default class MockReceiptApi extends Api implements ReceiptApiInterface {

  public async uploadReceipt(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const resp = await this.post('/api/receipt/parse?mock=1', {
      // this is to cancel out the default json content-type header
      headers: {},
    }, formData);
    return resp.json();
  }
}