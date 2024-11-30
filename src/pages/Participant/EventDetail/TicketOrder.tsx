import { useGetTicketsQuery } from 'Apis/ticketApi';
import { useEffect, useState } from 'react';
import TicketModel from 'Interfaces/ticketModel';
import { useNavigate } from 'react-router-dom';
import { SD_Sale_Method_Ticket, SD_Status_Ticket, SD_Visibility_Ticket } from 'Utility/SD';

interface TicketOrderProps {
  idEvent: string;
}

interface ticketQuantity {
  TicketId: string;
  quantity: number;
  nameTicket: string;
  price: number;
}

function TicketOrder({ idEvent }: TicketOrderProps) {
  const navigate = useNavigate();
  const { data, isFetching } = useGetTicketsQuery(idEvent);
  const [dataTickets, setDataTickets] = useState<TicketModel[]>([]);
  const [quantities, setQuantities] = useState<ticketQuantity[]>([]);

  useEffect(() => {
    if (data?.result) {
      setDataTickets(data.result);
      const initQuantities = data.result.map((ticket: TicketModel) => ({
        TicketId: ticket.idTicket,
        nameTicket: ticket.nameTicket,
        price: ticket.price,
        quantity: ticket.quantity > 0 ? 0 : -1,
      }));
      setQuantities(initQuantities);
    }
  }, [data]);

  const handleIncrement = (ticketId: string) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((item) =>
        item.TicketId === ticketId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (ticketId: string) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((item) =>
        item.TicketId === ticketId && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleGoPageCheckout = () => {
    navigate("/checkout", { state: { quantities } });
  };

  const totalQuantity = quantities.reduce((total, item) => total + (item.quantity > 0 ? item.quantity : 0), 0);
  const totalPrice = quantities.reduce((total, item) => {
    const ticket = dataTickets.find((ticket) => ticket.idTicket === item.TicketId);
    return total + (ticket?.price || 0) * (item.quantity > 0 ? item.quantity : 0);
  }, 0);

  return (
    <div className="flex justify-between gap-8 p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Tickets Order */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {dataTickets.map((ticket, index) => {
          // Kiểm tra Visibility của ticket
          if (ticket.visibility !== SD_Visibility_Ticket.VISIBLE) {
            return null; // Bỏ qua ticket nếu Visibility không phải là "Visible"
          }

          return (
            <div
              key={index}
              className="max-w-md mx-auto p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
            >
              {/* Header Section */}
              <div className="flex justify-between items-center mb-2 gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800 w-[200px]">
                    {ticket?.nameTicket}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {ticket.eventDate.startTime} - {ticket.eventDate.endTime}
                  </p>
                </div>


                {/* Quantity Controls */}
                {ticket.saleMethod === SD_Sale_Method_Ticket.ONLINE ? (ticket.quantity > 0 && ticket.status === SD_Status_Ticket.ON_SALE) ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDecrement(ticket.idTicket)}
                      className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                    >
                      –
                    </button>
                    <span className="px-3">
                      {quantities.find((q) => q.TicketId === ticket.idTicket)?.quantity || 0}
                    </span>
                    <button
                      onClick={() => handleIncrement(ticket.idTicket)}
                      className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="text-red-500">Sold out</div>
                ) : (<div className="text-yellow-700">Ticket sale ON SITE</div>)}
              </div>

              {/* Content Section */}
              <div className="mt-3 border-t pt-3 text-gray-700">
                <div className="flex flex-row justify-between">
                  <p className="text-base font-semibold">Price</p>
                  <p className="text-base font-semibold">{ticket.price} $</p>
                </div>
                <p className="text-sm">{ticket.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Area Summary Order */}
      <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p className="mb-2">Total Quantity: {totalQuantity}</p>
        <p className="mb-4">Total Price: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={handleGoPageCheckout}
          disabled={totalQuantity === 0}
          className={`px-4 py-2 rounded-lg ${totalQuantity === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          Go Order
        </button>
      </div>
    </div>
  );
}

export default TicketOrder;
