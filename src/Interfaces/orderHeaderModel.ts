import userModel from "./userModel";

export default interface orderHeaderModel {
  idOrderHeader: string;
  userId: string;
  user: userModel;
  numberPhone: string;
  orderDate: string;
  priceTotal: number;
  status: string;
  totalItem: number;
}
