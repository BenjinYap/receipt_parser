export default class ApiErrorResponse {
  constructor(
    public code: string,
    public errorData: any,
  ) {
  }
}