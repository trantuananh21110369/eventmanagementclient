import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useChangeStatusOrganizationMutation, useGetOrganizationsQuery } from 'Apis/organizationApi';
import { toastNotify } from 'Helper';
import { useNavigate } from 'react-router-dom';
import { SD_OrganizationStatus } from 'Utility/SD';
import { apiResponse } from 'Interfaces';
import { organizationModel } from 'Interfaces';

const OrganizationStatus = [
  SD_OrganizationStatus.ACTIVE,
  SD_OrganizationStatus.INACTIVE,
  SD_OrganizationStatus.PENDING,
];

function ListOrganizationPage() {
  const navigate = useNavigate();
  const { data: fetchedOrganizationData, isFetching } = useGetOrganizationsQuery({});
  const [changeStatus] = useChangeStatusOrganizationMutation();
  const [organizationData, setOrganizationData] = useState<organizationModel[]>([]);

  useEffect(() => {
    if (!isFetching && fetchedOrganizationData) {
      setOrganizationData(fetchedOrganizationData?.result);
    }
  }, [isFetching, fetchedOrganizationData]);

  const handleChangeStatus = async (id: string, status: string) => {
    console.log(id, status);
    const res: apiResponse = await changeStatus({ organizationId: id, status: status });
    if (res.data?.isSuccess) {
      toastNotify("Organization status updated successfully", "success");
    } else {
      toastNotify("Organization status update failed", "error");
    }
  };

  const columns: TableColumn<organizationModel>[] = [
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.urlImage || 'https://via.placeholder.com/50'}
          alt="Organization"
          className="w-12 h-12 rounded-md"
          style={{ width: "50px", height: "50px", borderRadius: "6px" }}
        />
      ),
      sortable: false,
      width: "80px",
    },
    {
      name: 'Organization Name',
      selector: row => row.nameOrganization,
      sortable: true,
    },
    {
      name: 'Location',
      selector: row => `${row.city}, ${row.country}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    }
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
        Organization List
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
            data={organizationData}
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

export default ListOrganizationPage;
