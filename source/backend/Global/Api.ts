type SuccessResponse = {
  success: boolean,
  data: any,
};

type ErrorResponse = {
  success: boolean,
  code: string,
  errorData: any,
};

export default class Api {
  public buildSuccessResponse(data: any): SuccessResponse {
    return {success: true, data: data};
  }

  public buildErrorResponse(code: string, errorData: any): ErrorResponse {
    return {success: true, code: code, errorData: errorData};
  }
}