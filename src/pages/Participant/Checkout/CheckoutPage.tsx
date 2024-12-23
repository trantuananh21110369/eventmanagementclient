import { useCreateOrderMutation } from 'Apis/orderApi';
import { inputHepler, toastNotify } from 'Helper';
import { apiResponse } from 'Interfaces';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from 'Storage/Redux/store';
import { SD_EOrderCreate } from 'Utility/SD';

const infoData = {
  numberPhone: '',
}

interface ticketQuantity {
  TicketId: string;
  quantity: number;
  nameTicket: string;
  price: number;
}


function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const user = useSelector((state: RootState) => state.userAuthStore);
  const quantitiesTicketData: ticketQuantity[] = location.state?.quantities;

  const [inputInfo, setInputInfo] = useState(infoData);

  const handleEventInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHepler(e, inputInfo);
    setInputInfo(tempData);
  };

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      UserId: user.id,
      NumberPhone: inputInfo.numberPhone,
      OrderDetails: quantitiesTicketData, // Đảm bảo rằng dữ liệu này là một đối tượng hoặc mảng hợp lệ
    };

    const rs: apiResponse = await createOrder(data); // Gửi dưới dạng JSON

    if (rs.data?.isSuccess) {
      navigate('/payment', { state: { apiResult: rs?.data, userInput: data } });
    }
    else {
      if (rs.data?.errorMessages && rs.data.errorMessages[0] == SD_EOrderCreate.OUT_OF_STOCK) {
        toastNotify("Out of stock", "error");
      }
      else if (rs.data?.errorMessages && rs.data.errorMessages[0] == SD_EOrderCreate.NOT_FOUND_ITEM) {
        toastNotify("Can find your", "error");
      }
    }
  }

  return (
    <form method="Post" onSubmit={handleConfirm} className="mx-auto max-w-3xl p-6">
      {/* Area Order Summary */}
      <div className="flex flex-col space-y-4">
        {/* Info ticket */}
        <h1 className="text-2xl font-semibold">Order Information</h1>
        <h2 className="text-lg">Name Order: {user.fullName}</h2>
        <h2 className="text-lg">Number Phone</h2>
        <input
          type="phone"
          placeholder="Enter your phone"
          value={inputInfo.numberPhone}
          name="numberPhone"
          onChange={handleEventInput}
          className="border p-2 rounded-lg w-full"
        />

        {/* Summary Ticket */}
        <h1 className="text-2xl font-semibold mt-6">Summary Order</h1>

        {/* Header Row */}
        <div className="flex flex-row justify-between font-semibold mt-2">
          <p className="w-1/3">Name</p>
          <p className="w-1/3">Quantity</p>
          <p className="w-1/3">Price</p>
        </div>

        {/* Ticket Data */}
        {
          quantitiesTicketData.map((ticket, index) => (
            <div key={index} className="flex flex-row justify-between mt-1">
              <p className="w-1/3">{ticket.nameTicket}</p>
              <p className="w-1/3">{ticket.quantity}</p>
              <p className="w-1/3">{ticket.price} $</p>
            </div>
          ))
        }

        {/* Area summary price */}
        <div className="flex justify-end items-center py-3 border-t">
          <p className="text-2xl font-semibold px-5">Total price:</p>
          <p className="text-xl font-medium">{quantitiesTicketData.reduce((sum, ticket) => {
            console.log(ticket.nameTicket + " :" + ticket.price);
            return sum + ticket.price;
          }, 0)} $</p>
        </div>

        {/* Area Payment */}
        <div className="flex justify-end items-center mt-8">
          <button
            className="bg-primary text-white p-3 rounded-full w-36">
            Confirm
          </button>
        </div>
      </div>
    </form>
  )
}

export default CheckoutPage
