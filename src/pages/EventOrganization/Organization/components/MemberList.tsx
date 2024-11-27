import { useKickMemberInOrganizationMutation } from 'Apis/roleApi';
import { toastNotify } from 'Helper';
import { apiResponse } from 'Interfaces';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

import UpsertRoleUserPopup from './UpsertRoleUserPopup';


interface MemberListProps {
  dataMemberList: any;
  isLoading: boolean;
}

function MemberList({ dataMemberList, isLoading }: MemberListProps) {

  // Local states
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [kickMember] = useKickMemberInOrganizationMutation();

  // Handle member detail and open the modal
  const handleDetail = (idUser: string) => {
    setCurrentUserId(idUser);
    toggleModal();
  };

  // Kick member from organization
  const handleKick = async (memberId: string) => {
    const res: apiResponse = await kickMember(memberId);
    if (res.data?.isSuccess) {
      toastNotify("Kick member success", "success");
    }
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Data table columns
  const columns: TableColumn<any>[] = [
    {
      name: 'Full Name',
      selector: row => row.user?.fullName,
    },
    {
      name: 'Email',
      selector: row => row.user?.email,
    },
    {
      name: "Action",
      cell: row => (
        <div>
          <button
            className="px-3 py-1 text-white bg-green-500 rounded"
            onClick={() => handleDetail(row.user.id)}
          >
            Detail
          </button>
          <button
            className="px-3 py-1 text-white bg-red-500 rounded"
            onClick={() => handleKick(row.memberId)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={dataMemberList} progressPending={isLoading} pagination={false} />

      {/* Modal component */}
      <UpsertRoleUserPopup
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        userId={currentUserId}
      />
    </div>
  );
}

export default MemberList;
