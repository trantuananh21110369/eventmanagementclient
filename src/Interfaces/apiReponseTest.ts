export default interface apiResponseTest {
  data1?: {
    statusCode?: number;
    isSuccess?: boolean;
    errorMessages?: Array<string>;
    result: { [key: string]: string };
  };
  error?: any;
}
