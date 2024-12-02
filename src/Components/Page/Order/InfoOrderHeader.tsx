import { orderHeaderModel } from "Interfaces";

interface InfoOrderHeaderProps {
  orderHeader: orderHeaderModel;
  isLoading: boolean;
}

function InfoOrderHeader({ orderHeader, isLoading }: InfoOrderHeaderProps) {
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-6 py-2 bg-white shadow-lg rounded-lg max-w-xl mx-auto mb-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Order Details</h1>
      <div className="space-y-4">
        <div className="flex justify-between text-lg">
          <span className="font-medium">Order ID:</span>
          <span>{orderHeader.idOrderHeader}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Full Name:</span>
          <span>{orderHeader.user.fullName}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Email:</span>
          <span>{orderHeader.user.email}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Total Type Of Ticket:</span>
          <span>{orderHeader.totalItem}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Order Date:</span>
          <span>{orderHeader.orderDate}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Status:</span>
          <span className={`font-semibold ${orderHeader.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
            {orderHeader.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InfoOrderHeader;
