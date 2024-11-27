export default interface apiResponse {
  data?: {
    statusCode?: number;
    isSuccess?: boolean;
    errorMessages?: Array<String>;
    result: { [key: string]: string };
  };
  error?: any;
}
