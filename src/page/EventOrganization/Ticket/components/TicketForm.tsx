import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SD_Status_Ticket, SD_Visibility_Ticket, SD_Sale_Method_Ticket } from 'Utility/SD';
import { SubmitButton } from 'Components/UI';
import { inputHepler, toastNotify } from 'Helper';
import { formatDateTime } from 'Utility/formatDate';
import ticketFormProps from '../interfaces/ticketFormProps';
import { useCreateTicketMutation, useUpdateTicketMutation } from 'Apis/ticketApi';

const StatusTicket = [
  SD_Status_Ticket.ON_SALE,
  SD_Status_Ticket.SOLD,
];

const VisibilityTicket = [
  SD_Visibility_Ticket.VISIBLE,
  SD_Visibility_Ticket.HIDDEN,
];

const SaleMethodTicket = [
  SD_Sale_Method_Ticket.ONLINE,
  SD_Sale_Method_Ticket.ONSITE,
  SD_Sale_Method_Ticket.ONLINE_AND_ONSITE,
];

const ticketData = {
  idTicket: '',
  eventId: '',
  eventDateId: '',
  nameTicket: '',
  quantity: 0,
  price: 0,
  saleStartDate: formatDateTime(new Date()),
  saleEndDate: formatDateTime(new Date()),
  description: '',
  status: StatusTicket[0],
  visibility: VisibilityTicket[0],
  saleMethod: SaleMethodTicket[0],
};

const TicketForm = ({ listEventDates, ticket, onClose }: ticketFormProps) => {
  const navigate = useNavigate();
  const { idEvent } = useParams();
  console.log(idEvent);
  const [ticketInputs, setTicketInputs] = useState(ticketData);
  const [updateTicket] = useUpdateTicketMutation();
  const [createTicket] = useCreateTicketMutation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTicketInputs({ ...ticketInputs, eventId: idEvent ?? '' });
    if (ticket) {
      setTicketInputs({
        ...ticket,
        saleStartDate: formatDateTime(new Date(ticket.saleStartDate)),
        saleEndDate: formatDateTime(new Date(ticket.saleEndDate)),
      });
    }
  }, [ticket]);

  const handleTicketInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHepler(e, ticketInputs);
    setTicketInputs(tempData);
  };

  console.log(ticketInputs)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (ticket?.idTicket) {
        await updateTicket({ data: ticketInputs, idTicket: ticket.idTicket });
      }
      else {
        await createTicket(ticketInputs);
      }

      toastNotify("Ticket saved successfully!", "success");
      onClose();
    } catch (error) {
      toastNotify("Failed to save ticket. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='flex flex-col' onSubmit={handleSubmit}>
      <div className="mb-4 border-input">
        <h2 className="text-xl font-bold mb-2">Ticket Overview</h2>
        <input type="text" placeholder="Ticket Name" name="nameTicket" value={ticketInputs.nameTicket} onChange={handleTicketInput} className="w-full px-4 py-2 border rounded-md mb-2" />
        <textarea placeholder="Description" name="description" value={ticketInputs.description} onChange={handleTicketInput} className="w-full px-4 py-2 border rounded-md" />
      </div>

      <div className="mb-4 border-input">
        <h2 className="text-xl font-bold mb-2">Select Ticket For Date</h2>
        <select
          className='w-full px-4 py-2 border rounded-md mb-2'
          name="eventDateId"
          value={ticketInputs.eventDateId}
          onChange={handleTicketInput}>
          <option value="" disabled>Select Event Date</option>
          {listEventDates.map((item: { dateTitle: string, eventDateId: string }, index: number) => (
            <option key={index} value={item.eventDateId}>{item.dateTitle}</option>
          ))}
        </select>
      </div>

      {/*Ticket Deatils*/}
      <div className="mb-4 border-input">
        <h2 className="text-xl font-bold mb-2">Ticket Details</h2>
        <div className="flex flex-row justify-between items-center gap-2">
          <h3 className="w-1/4">Quantity: </h3>
          <input type="number" placeholder="Quantity" name="quantity" value={ticketInputs.quantity} onChange={handleTicketInput} className="w-3/4 px-4 py-2 border rounded-md mb-2" />
        </div>
        <div className="flex flex-row justify-between items-center gap-2">
          <h3 className="w-1/4">Price: </h3>
          <input type="number" placeholder="Price" name="price" value={ticketInputs.price} onChange={handleTicketInput} className="w-3/4 px-4 py-2 border rounded-md mb-2" />
        </div>
        <div className="flex flex-row justify-between items-center gap-2">
          <h3 className="w-1/4">Sale Start Date: </h3>
          <input
            type="datetime-local"
            placeholder="Sale Start Date and Time"
            name="saleStartDate"
            value={ticketInputs.saleStartDate} // Format for datetime-local
            onChange={handleTicketInput}
            className="w-3/4 px-4 py-2 border rounded-md mb-2"
          />
        </div>
        <div className="flex flex-row justify-between items-center gap-2">
          <h3 className="w-1/4">Sale End Date: </h3>
          <input
            type="datetime-local"
            placeholder="Sale End Date and Time"
            name="saleEndDate"
            value={ticketInputs.saleEndDate} // Format for datetime-local
            onChange={handleTicketInput}
            className="w-3/4 px-4 py-2 border rounded-md mb-2"
          />
        </div>
      </div>

      {/*Ticket Settings*/}
      <div className="mb-4 border-input">
        <h2 className="text-xl font-bold mb-2">Ticket Settings</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h2 className="text-base mb-1">Status Ticket</h2>
            <select
              className='w-full px-4 py-2 border rounded-md mb-2'
              name="status"
              value={ticketInputs.status}
              onChange={handleTicketInput}>
              {StatusTicket.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <h2 className="text-base mb-1">Visibility</h2>
            <select
              className='w-full px-4 py-2 border rounded-md mb-2'
              name="visibility"
              value={ticketInputs.visibility}
              onChange={handleTicketInput}>
              {VisibilityTicket.map((visibility) => (
                <option key={visibility} value={visibility}>{visibility}</option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-base mb-1">Sale Method</h2>
            <select
              className='w-full px-4 py-2 border rounded-md mb-2'
              name="saleMethod"
              value={ticketInputs.saleMethod}
              onChange={handleTicketInput}>
              {SaleMethodTicket.map((saleMethod) => (
                <option key={saleMethod} value={saleMethod}>{saleMethod}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      <div className='self-end'>
        <SubmitButton text="Save" />
      </div>
    </form>
  );
};

export default TicketForm;
