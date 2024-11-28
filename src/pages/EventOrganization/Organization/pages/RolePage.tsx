import React, { useEffect, useState } from 'react'
import { useGetRolesByIdOrganizationQuery } from 'Apis/roleApi';
import RoleList from '../components/RoleList';
import { useSelector } from 'react-redux';
import { RootState } from 'Storage/Redux/store';
import UpsertRolePopup from '../components/UpsertRolePopup';

interface ListRoleView {
  id: string;
  name: string;
}

function RolePage() {
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);

  const { data, isFetching } = useGetRolesByIdOrganizationQuery(idOrganization);
  const [dataRoleList, setDataRoleList] = useState<ListRoleView[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentRoleId, setCurrentRoleId] = useState<string>('');

  useEffect(() => {
    if (data) {
      setDataRoleList(data?.result);
    }
  }, [data]);

  const handleCreatePopup = () => {
    setCurrentRoleId("");
    toggleModal();
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="p-3 shadow-lg">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold mb-3">List Roles</h2>
        <button
          className="px-3 py-1 text-white bg-green-500 rounded items-end"
          onClick={handleCreatePopup}
        >
          Create Role
        </button>
      </div>
      <RoleList dataRoleList={dataRoleList} isLoading={isFetching} />

      {/* Modal component */}
      <UpsertRolePopup
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        roleId={currentRoleId}
      />
    </div>
  )
}

export default RolePage