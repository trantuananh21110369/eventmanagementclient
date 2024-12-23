import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useGetAllUserQuery, useBlockUserMutation } from 'Apis/authApi';
import { toastNotify } from 'Helper';

function ListUserPage() {
  const { data: fetchedUserData, isFetching } = useGetAllUserQuery({});
  const [blockUser] = useBlockUserMutation();
  const [userData, setUserData] = useState<User[]>([]);
  interface User {
    urlImage: string
    id: string
    fullName: string
    email: string
    lockoutEnabled: boolean
  }
  useEffect(() => {
    if (!isFetching && fetchedUserData) {
      setUserData(fetchedUserData?.result);
    }
  }, [isFetching, fetchedUserData]);

  const handleBlockUser = async (id: string, lockoutEnabled: boolean) => {
    const res = await blockUser({ userId: id });
    if (res.data?.isSuccess) {
      toastNotify("User status updated successfully", "success");
    } else {
      toastNotify("User status update failed", "error");
    }
  };

  const columns: TableColumn<User>[] = [
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.urlImage || 'https://via.placeholder.com/50'}
          alt="User"
          className="w-12 h-12 rounded-md"
          style={{ width: "50px", height: "50px", borderRadius: "6px" }}
        />
      ),
      sortable: false,
      width: "80px",
    },
    {
      name: 'Full Name',
      selector: row => row.fullName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <select
          value={row.lockoutEnabled ? 'Lock' : 'Unlock'}
          onChange={() => handleBlockUser(row.id, row.lockoutEnabled)}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
            border: "1px solid #d1d5db",
            minWidth: "120px",
          }}
        >
          <option value="Lock">Lock</option>
          <option value="Unlock">Unlock</option>
        </select>
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
        User List
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
            data={userData}
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

export default ListUserPage;