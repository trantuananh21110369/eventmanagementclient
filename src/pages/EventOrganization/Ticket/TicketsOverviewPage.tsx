import { useEffect, useState } from 'react';
import { useGetEventDatesQuery } from 'Apis/eventDateApi';
import { useParams } from 'react-router-dom';
import { useDeleteTicketMutation, useGetTicketsQuery } from 'Apis/ticketApi';
import TicketModel from 'Interfaces/ticketModel';
import TicketForm from 'pages/EventOrganization/Ticket/TicketForm';

function TicketsOverviewPage() {
  const [isTicketFormVisible, setTicketFormVisible] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<TicketModel | null>(null);
  const [deleteTicket] = useDeleteTicketMutation();
  const { idEvent } = useParams();
  const { data } = useGetEventDatesQuery(idEvent);
  const { data: dataTicket, isFetching } = useGetTicketsQuery(idEvent);
  const [listEventDates, setListEventDate] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<TicketModel[]>([]);

  useEffect(() => {
    if (data) {
      const tempData = data.result.map((item: { dateTitle: string, idEventDate: string }) => ({
        dateTitle: item.dateTitle,
        eventDateId: item.idEventDate,
      }));
      setListEventDate(tempData);
    }
  }, [data]);

  useEffect(() => {
    if (dataTicket) {
      const tickets = dataTicket.result.filter((ticket: TicketModel) =>
        ticket.nameTicket.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTickets(tickets);
    }
  }, [dataTicket, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddTicketClick = () => {
    setTicketToEdit(null);
    setTicketFormVisible(true);
  };

  const handleEditTicketClick = (ticket: TicketModel) => {
    setTicketToEdit(ticket);
    setTicketFormVisible(true);
  };

  const handleCloseTicketForm = () => {
    setTicketFormVisible(false);
  };

  const handleDeleteTicketForm = async (idTicket: string) => {
    await deleteTicket(idTicket);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        {/* Search input with search button */}
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search tickets"
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-3 rounded-lg w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {/* Search icon */}
          <button className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 hover:text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.65 10.6a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-row gap-2">
          
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            onClick={handleAddTicketClick}
          >
            Add Ticket
          </button>
        </div>
      </div>

      <div>
        {isFetching ? (
          <p className="text-center text-gray-500">Loading tickets...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket: TicketModel) => (
              <div key={ticket.idTicket} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{ticket.nameTicket}</h3>
                  <p className="text-gray-600">Quantity: {ticket.quantity}</p>
                  <p className="text-gray-600">Price: ${ticket.price}</p>
                  <p className="text-gray-600">Status: {ticket.status}</p>
                  <p className="text-gray-600">Visibility: {ticket.visibility}</p>
                  <p className="text-gray-600">Sale Method: {ticket.saleMethod}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition w-full"
                    onClick={() => handleEditTicketClick(ticket)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition w-full"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete?")) {
                        handleDeleteTicketForm(ticket.idTicket);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TicketForm Modal */}
      {isTicketFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="bg-white mt-80 p-6 rounded-lg shadow-lg w-full max-w-2xl ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{ticketToEdit ? 'Edit Ticket' : 'Add Ticket'}</h2>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
                onClick={handleCloseTicketForm}
              >
                Close
              </button>
            </div>
            <TicketForm
              listEventDates={listEventDates}
              ticket={ticketToEdit}
              onClose={handleCloseTicketForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsOverviewPage;
