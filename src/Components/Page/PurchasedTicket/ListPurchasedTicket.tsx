import React, { useState } from "react";
import DataTable, { TableColumn } from 'react-data-table-component';
import { purchasedTicketModel } from "Interfaces";
import PurchasedTicketPopup from "./PurchasedTicketPopup";

interface ListPurchasedTicketProps {
  dataTickets: purchasedTicketModel[];
  isLoading: boolean;
  isOrganization: boolean;
}

function ListPurchasedTicket({ dataTickets, isLoading, isOrganization = false }: ListPurchasedTicketProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isOpen, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setSelectedTicketId(null); };

  const handleDetail = (PurchasedTicketId: string) => {
    if (PurchasedTicketId) {
      handleOpen();
      setSelectedTicketId(PurchasedTicketId);
    }
  };

  const columns: TableColumn<purchasedTicketModel>[] = [
    {
      name: 'Id Purchased Ticket',
      selector: row => row.idPurchasedTicket,
    },
    {
      name: 'Full Name',
      selector: row => row.fullName,
    },
    {
      name: 'Email',
      selector: row => row.email,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
    },
    {
      name: 'Status',
      selector: row => row.status,
    },
    {
      name: "Action",
      cell: row => (
        <div>
          <button
            className="px-3 py-1 text-white bg-green-500 rounded"
            onClick={() => handleDetail(row.idPurchasedTicket)}
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={dataTickets} progressPending={isLoading} pagination={false} />
      {selectedTicketId && (
        <PurchasedTicketPopup PurchasedTicketId={selectedTicketId} isOpen={isOpen} handleClose={handleClose} isOrganization={isOrganization} />
      )}
    </div>
  )
}

export default ListPurchasedTicket;