export default interface ReceiptApiInterface {
  uploadReceipt: (file: File) => Promise<any>;
}