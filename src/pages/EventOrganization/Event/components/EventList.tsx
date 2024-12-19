import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import EventModel from '../../../../Interfaces/eventModel';
import getStatusColor from '../../../../Helper/getStatusColor';
import { useNavigate } from 'react-router-dom';
import { SD_Privacy_Event } from 'Utility/SD';
import { useUpdatePrivacyEventMutation } from 'Apis/eventApi';
import { apiResponse } from 'Interfaces';
import { toastNotify } from 'Helper';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface eventListProps {
  isFetching: boolean;
  eventData: EventModel[];
}

const StatusPrivacy = [
  SD_Privacy_Event.PUBLIC,
  SD_Privacy_Event.PRIVATE,
];

function EventList({ isFetching, eventData }: eventListProps) {
  const navigate = useNavigate();
  const [updatePrivacy] = useUpdatePrivacyEventMutation();

  const handleUpdate = (eventId: string) => {
    navigate(`../update/${eventId}/edit`);
  };

  const handleUpdatePrivacy = async (e: React.ChangeEvent<HTMLSelectElement>, idEvent: string) => {
    try {
      const res: apiResponse = await updatePrivacy({ idEvent: idEvent, privacy: e.target.value });
      if (res.data?.isSuccess) {
        toastNotify("Event updated successfully", "success");
      }
    } catch (err: any) {
      if (err.status === 403) {
        toastNotify("You do not have permission to update this event", "error");
      } else {
        console.error("Unexpected Error:", err);
        toastNotify("An unexpected error occurred", "error");
      }
    }
  };

  const handleViewReport = (eventId: string) => {
    navigate("report/" + eventId);
  }

  const columns: TableColumn<EventModel>[] = [
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.urlImage || 'https://via.placeholder.com/50'}
          alt="Event"
          className="w-12 h-12 rounded-md"
          style={{ width: "50px", height: "50px", borderRadius: "6px" }}
        />
      ),
      sortable: false,
      width: "80px",
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "6px",
              padding: "2px 8px",
              fontSize: "12px",
              fontWeight: 500,
              color: `${badgeColor}`,
              border: `1px solid ${badgeColor}`,
            }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      name: "Privacy",
      cell: row => {
        return (
          <select
            style={{
              minWidth: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              marginBottom: "8px",
            }}
            value={row.privacy}
            onChange={(e) => handleUpdatePrivacy(e, row.idEvent!)}
          >
            {StatusPrivacy.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      name: 'Action',
      cell: row => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              border: "none",
              minWidth: "80px", // Thêm minWidth để đảm bảo nút không bị nhỏ lại
            }}
            onClick={() => handleUpdate(row.idEvent!)}
          >
            Update
          </button>
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              border: "none",
              minWidth: "80px", // Thêm minWidth để đồng bộ kích thước
            }}
            onClick={() => handleViewReport(row.idEvent!)}
          >
            View Report
            <DashboardIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "6px",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
        Event List
      </h2>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <DataTable
            columns={columns}
            data={eventData}
            highlightOnHover
            striped
            customStyles={{
              table: {
                style: {
                  width: "100%",
                  minWidth: "700px",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EventList;
