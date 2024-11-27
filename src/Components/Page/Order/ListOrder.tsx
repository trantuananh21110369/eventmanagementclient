import React from "react";
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from "react-router-dom";

interface OrderListProps {
  dataOrder: any;
  isLoading: boolean;
}


function ListOrder({ dataOrder, isLoading }: OrderListProps) {
  const navigate = useNavigate();

  const handleDetail = (idOrderHeader: string) => {
    navigate("../order-detail/" + idOrderHeader);
  };

  const columns: TableColumn<any>[] = [
    {
      name: 'Event Name',
      selector: row => row.nameEvent,
    },
    {
      name: 'Buyer Name',
      selector: row => row.nameBuyer,
    },
    {
      name: 'Invoice Date',
      selector: row => new Date(row.invoiceDate).toLocaleDateString(),
    },
    {
      name: 'Total Price',
      selector: row => `$${row.totalPrice.toFixed(2)}`,
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
            onClick={() => handleDetail(row.idOrderHeader)}
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  return (<DataTable columns={columns} data={dataOrder} progressPending={isLoading} pagination={false} />)
}

export default ListOrder;
