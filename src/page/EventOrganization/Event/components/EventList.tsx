import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import eventListProps from '../interface/eventListType';
import EventModel from '../../../../Interfaces/eventModel';
import getStatusColor from '../../../../Helper/getStatusColor';
import { useNavigate } from 'react-router-dom';

function EventList({ isFetching, eventData }: eventListProps) {
  const navigate = useNavigate();

  const handleUpdate = (eventId: string) => {
    navigate(`../update/${eventId}/edit`);
  };

  const columns: TableColumn<EventModel>[] = [
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.urlImage || 'https://via.placeholder.com/50'}
          alt="Event"
          className="w-12 h-12 rounded-md"
        />
      ),
      sortable: false,
      width: "80px", // Cố định độ rộng cột
    },
    {
      name: 'Event Name',
      selector: row => row.nameEvent!,
      sortable: true,
    },
    {
      name: 'Location',
      selector: row => row.location!,
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => {
        const badgeColor = getStatusColor(row.status!);
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-${badgeColor}-400 ring-2 ring-${badgeColor}-500`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-white bg-blue-500 rounded"
            onClick={() => handleUpdate(row.idEvent!)}
          >
            Update
          </button>
          <button
            className="px-3 py-1 text-white bg-red-500 rounded"
            onClick={() => console.log(`Viewing event ${row.idEvent}`)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 shadow-lg">
      <h2 className="text-lg font-bold mb-3">Event List</h2>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={eventData}
          highlightOnHover
          striped
        />
      )}
    </div>
  );
}

export default EventList;
