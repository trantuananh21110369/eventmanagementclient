import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  SD_Status_Ticket,
  SD_Visibility_Ticket,
  SD_Sale_Method_Ticket,
} from "Utility/SD";
import { inputHepler, toastNotify } from "Helper";
import { formatDateTime } from "Utility/formatDate";
import { useCreateTicketMutation, useUpdateTicketMutation } from "Apis/ticketApi";
import TicketModel from "Interfaces/ticketModel";
import { Button } from "@headlessui/react";

interface ticketFormProps {
  listEventDates: { dateTitle: string; eventDateId: string }[];
  ticket: TicketModel | null;
  onClose: () => void;
}

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
];

const ticketData = {
  idTicket: "",
  eventId: "",
  eventDateId: "",
  nameTicket: "",
  quantity: 0,
  price: 0,
  saleStartDate: formatDateTime(new Date()),
  saleEndDate: formatDateTime(new Date()),
  description: "",
  status: StatusTicket[0],
  visibility: VisibilityTicket[0],
  saleMethod: SaleMethodTicket[0],
};

const TicketForm = ({ listEventDates, ticket, onClose }: ticketFormProps) => {
  const navigate = useNavigate();
  const { idEvent } = useParams();
  const [ticketInputs, setTicketInputs] = useState(ticketData);
  const [updateTicket] = useUpdateTicketMutation();
  const [createTicket] = useCreateTicketMutation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTicketInputs({ ...ticketInputs, eventId: idEvent ?? "" });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const startDate = new Date(ticketInputs.saleStartDate);
    const endDate = new Date(ticketInputs.saleEndDate);

    if (!ticketInputs.nameTicket.trim()) {
      toastNotify("Ticket name cannot be empty!", "error");
      setLoading(false);
      return;
    }
    // if (startDate < now) {
    //   toastNotify("Start date cannot be in the past!", "error");
    //   setLoading(false);
    //   return;
    // }
    if (endDate < startDate) {
      toastNotify("End date must be later than the start date!", "error");
      setLoading(false);
      return;
    }
    if (
      startDate.toDateString() === endDate.toDateString() &&
      endDate.getTime() <= startDate.getTime()
    ) {
      toastNotify("End time must be later than start time on the same day!", "error");
      setLoading(false);
      return;
    }
    if (ticketInputs.quantity <= 0) {
      toastNotify("Quantity must be greater than 0!", "error");
      setLoading(false);
      return;
    }
    if (ticketInputs.price <= 0) {
      toastNotify("Price must be greater than 0!", "error");
      setLoading(false);
      return;
    }

    try {
      if (ticket?.idTicket) {
        await updateTicket({ data: ticketInputs, idTicket: ticket.idTicket });
      } else {
        console.log("Ticket" + ticketInputs.quantity);
        await createTicket({ ticketData: ticketInputs });
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
    <form className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4" onSubmit={handleSubmit}>
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket Overview</h2>
        <input
          type="text"
          placeholder="Ticket Name"
          name="nameTicket"
          value={ticketInputs.nameTicket}
          onChange={handleTicketInput}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <textarea
          placeholder="Description"
          name="description"
          value={ticketInputs.description}
          onChange={handleTicketInput}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Event Date</h2>
        <select
          className="w-full px-4 py-2 border rounded-md mb-4"
          name="eventDateId"
          value={ticketInputs.eventDateId}
          onChange={handleTicketInput}
        >
          <option value="" disabled>
            Select Event Date
          </option>
          {listEventDates.map((item, index) => (
            <option key={index} value={item.eventDateId}>
              {item.dateTitle}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={ticketInputs.quantity}
              onChange={handleTicketInput}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-600">Price</label>
            <input
              type="number"
              placeholder="Price"
              name="price"
              value={ticketInputs.price}
              onChange={handleTicketInput}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-600">Sale Start Date</label>
            <input
              type="datetime-local"
              name="saleStartDate"
              value={ticketInputs.saleStartDate}
              onChange={handleTicketInput}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-600">Sale End Date</label>
            <input
              type="datetime-local"
              name="saleEndDate"
              value={ticketInputs.saleEndDate}
              onChange={handleTicketInput}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-600">Status</label>
            <select
              className="w-full px-4 py-2 border rounded-md"
              name="status"
              value={ticketInputs.status}
              onChange={handleTicketInput}
            >
              {StatusTicket.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Visibility</label>
            <select
              className="w-full px-4 py-2 border rounded-md"
              name="visibility"
              value={ticketInputs.visibility}
              onChange={handleTicketInput}
            >
              {VisibilityTicket.map((visibility) => (
                <option key={visibility} value={visibility}>
                  {visibility}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Sale Method</label>
            <select
              className="w-full px-4 py-2 border rounded-md"
              name="saleMethod"
              value={ticketInputs.saleMethod}
              onChange={handleTicketInput}
            >
              {SaleMethodTicket.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Ticket"}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
