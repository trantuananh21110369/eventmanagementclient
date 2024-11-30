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

  useEffect(() => {
    if (data) {
      const tempData = data.result.map((item: { dateTitle: string, idEventDate: string }) => ({ dateTitle: item.dateTitle, eventDateId: item.idEventDate }));
      setListEventDate(tempData);
    }
  }, [data]);

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
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        {/* Search input */}
        <input type="text" placeholder="Search events" className="border p-2 rounded mr-4" />

        <div className="flex flex-row gap-x-1">
          <button className="px-4 py-2 bg-blue-600 text-white">List View</button>
          <button className="px-4 py-2 border border-black rounded" onClick={handleAddTicketClick}>
            Add Ticket
          </button>
        </div>
      </div>

      <div>
        {isFetching ? (
          <p>Loading tickets...</p>
        ) : (
          dataTicket?.result.map((ticket: TicketModel) => (
            <div key={ticket.idTicket} className="border-t border-gray-200 py-4">
              <div className="flex items-center">
                <div className="w-3/12">
                  <p className="font-semibold">{ticket.nameTicket}</p>
                  <p className="text-sm text-gray-600">Quantity: {ticket.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ${ticket.price}</p>
                </div>
                <div className="w-2/12 text-center">{ticket.status}</div>
                <div className="w-2/12 text-center">{ticket.visibility}</div>
                <div className="w-2/12 text-center">{ticket.saleMethod}</div>
                <div className="w-3/12 text-right">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-full mr-2" onClick={() => handleEditTicketClick(ticket)}>Edit</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-full" onClick={() => {
                    if (window.confirm("Are you sure you want to delete?")) {
                      handleDeleteTicketForm(ticket.idTicket);
                    }
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TicketForm pop-up */}
      {isTicketFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg max-h-[80vh] overflow-y-auto">
            <div className='flex flex-row justify-between items-center mb-4'>
              <h2 className="text-lg font-semibold">{ticketToEdit ? 'Edit Ticket' : 'Add Ticket'}</h2>
              <button className="px-4 py-2 bg-red-600 text-white rounded-full" onClick={handleCloseTicketForm}>
                Close
              </button>
            </div>
            <div className='overflow-y-auto'>
              <TicketForm listEventDates={listEventDates} ticket={ticketToEdit} onClose={handleCloseTicketForm} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsOverviewPage;
