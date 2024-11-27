import { useDeleteRoleMutation } from 'Apis/roleApi';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { RootState } from 'Storage/Redux/store';
import UpsertRolePopup from './UpsertRolePopup';
import { apiResponse } from 'Interfaces';

interface RoleListProps {
  dataRoleList: ListRoleView[];
  isLoading: boolean;
}

interface ListRoleView {
  id: string;
  name: string;
}

function RoleList({ dataRoleList, isLoading }: RoleListProps) {
  const [deleteRole] = useDeleteRoleMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentRoleId, setCurrentRoleId] = useState<string>('');

  const columns: TableColumn<ListRoleView>[] = [
    {
      name: 'Role Name',
      selector: (row: ListRoleView) => row.name,
    },
    {
      name: 'Action',
      cell: (row: ListRoleView) => (
        <div>
          <button
            className="px-3 py-1 text-white bg-blue-500 rounded"
            onClick={() => handleDetail(row.id)}
          >
            Detail
          </button>
          <button
            className="px-3 py-1 text-white bg-red-500 rounded"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDetail = (id: string) => {
    setCurrentRoleId(id);
    toggleModal();
  };


  const handleDelete = async (id: string) => {
    const apiRes: apiResponse = await deleteRole(id);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <DataTable columns={columns} data={dataRoleList} />

      {/* Modal component */}
      <UpsertRolePopup
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        roleId={currentRoleId}
      />
    </div>
  );
}

export default RoleList;
