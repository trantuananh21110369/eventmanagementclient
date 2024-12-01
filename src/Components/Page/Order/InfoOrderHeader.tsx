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
      <p>Order ID: {orderHeader.idOrderHeader}</p>
      <p>Full Name: {orderHeader.user.fullName}</p>
      <p>Email: {orderHeader.user.email}</p>
      <p>Total Type Of Ticket: {orderHeader.totalItem} </p>
      <p>Order Date: {orderHeader.orderDate}</p>
      <p>Status: {orderHeader.status}</p>
    </div>
  );
}

export default InfoOrderHeader;
