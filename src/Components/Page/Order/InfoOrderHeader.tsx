import { orderHeaderModel } from "Interfaces";

interface InfoOrderHeaderProps {
  orderHeader: orderHeaderModel;
  isLoading: boolean;
}

function InfoOrderHeader({ orderHeader, isLoading }: InfoOrderHeaderProps) {
  console.log(orderHeader);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {orderHeader.numberPhone}</p>
      <p>Order Date: {orderHeader.orderDate}</p>
      <p>Status: {orderHeader.status}</p>
      <p>Total Item: {orderHeader.totalItem} </p>
    </div>
  );
}

export default InfoOrderHeader;
