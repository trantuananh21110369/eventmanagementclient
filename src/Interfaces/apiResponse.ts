export default interface apiResponse {
  data?: {
    statusCode?: number;
    isSuccess?: boolean;
    errorMessage?: Array<String>;
    result: { [key: string]: string };
  };
  error?: any;
}
