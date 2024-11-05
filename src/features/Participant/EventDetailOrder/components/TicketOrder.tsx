import { useGetTicketsQuery } from 'Apis/ticketApi';
import { useEffect, useState } from 'react';
import TicketModel from 'Interfaces/ticketModel';

interface TicketOrderProps {
  idEvent: string;
}

function TicketOrder({ idEvent }: TicketOrderProps) {
  const [quantity, setQuantity] = useState(0);
  const { data, isFetching } = useGetTicketsQuery(idEvent);
  const [dataTickets, setDataTickets] = useState([]);

  useEffect(() => { setDataTickets(data?.result) }, [data]);

  const handleIncrement = (ticket: TicketModel) => setQuantity(quantity + 1);
  const handleDecrement = (ticket: TicketModel) => setQuantity(quantity > 0 ? quantity - 1 : 0);

  return (
    <div className="flex justify-between gap-8 p-4 bg-gray-100 rounded-lg shadow-md">
      {/*Tickets Order*/}
      <div className='flex flex-col gap-3 overflow-y-auto '>
        {
          dataTickets?.map((ticket: TicketModel, index: number) => (
            <div key={index} className="max-w-md mx-auto p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-2 gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800 w-[200px]">
                    {ticket?.nameTicket}
                  </h2>
                  <p className="text-sm text-gray-600">{ticket.eventDate.startTime} - {ticket.eventDate.endTime}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecrement(ticket)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                  >
                    –
                  </button>
                  <span className="px-3">{quantity}</span>
                  <button
                    onClick={() => handleIncrement(ticket)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="mt-3 border-t pt-3 text-gray-700">
                <div className='flex flex-row justify-between'>
                  <p className="text-base font-semibold">Price</p>
                  <p className="text-base font-semibold">{ticket.price} $</p>
                </div>

                <p className="text-sm">{ticket.description}</p>
              </div>
            </div>))
        }
      </div>


      {/*Area Summary Order*/}
      <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p className="mb-2">Total Quantity: {quantity}</p>
        <p className="mb-4">Total Price: $</p>
        <button
          disabled={quantity === 0}
          className={`px-4 py-2 rounded-lg ${quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default TicketOrder;