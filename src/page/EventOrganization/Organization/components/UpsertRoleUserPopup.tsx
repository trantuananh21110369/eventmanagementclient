import { useAddUserRolesMutation, useGetRolesByIdOrganizationQuery, useGetUserRoleDetailQuery } from 'Apis/roleApi';
import { inputHepler, toastNotify } from 'Helper';
import { apiResponse } from 'Interfaces';
import roleModel from 'Interfaces/roleModel';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { RootState } from 'Storage/Redux/store';

interface UpsertRoleUserPopupProps {
  isOpen: boolean;
  toggleModal: () => void;
  userId: string;
}

function UpsertRoleUserPopup({
  isOpen,
  toggleModal,
  userId,
}: UpsertRoleUserPopupProps) {
  console.log(userId);
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);
  const { data: rolesData, isFetching: isFetchingRoles } = useGetRolesByIdOrganizationQuery(idOrganization);
  const { data: userRolesData, isFetching: isFetchingUserRoles } = useGetUserRoleDetailQuery(userId);
  const [updateUserRoles] = useAddUserRolesMutation();
  const [roles, setRoles] = useState<roleModel[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]); //Mảng string id của role
  const [roleSelected, setRoleSelected] = useState<string>('');

  useEffect(() => {
    if (userRolesData?.result) {
      setSelectedRoles(userRolesData.result);
    }
  }, [userRolesData]);

  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData?.result);
    }
  }, [rolesData]);

  // handle role selection
  const handleRoleChange = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleUpdateRole = async () => {
    const tempData = {
      IdUser: userId,
      IdRoles: selectedRoles
    };
    const res: apiResponse = await updateUserRoles(tempData);
    if (res.data?.isSuccess) {
      toastNotify("Update role success", "success");
      handleCloseModal();
    }
  }

  const handleCloseModal = () => {
    setSelectedRoles([]);
    toggleModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      ariaHideApp={false}
    >
      <h3 className="text-xl font-bold mb-4">Update User Roles</h3>

      {/* Role Selection */}
      <div className="mb-3">
        <label className="block mb-1 text-gray-700">Roles</label>
        {roles.map((role) => (
          <div key={role.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={role.id}
              checked={selectedRoles.includes(role.id)}
              onChange={() => handleRoleChange(role.id)}
              className="mr-2"
            />
            <label htmlFor={role.id} className="text-gray-800">
              {role.name}
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-gray-300 rounded mr-2"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleUpdateRole}
        >
          Update
        </button>
      </div>
    </Modal>
  );
};

export default UpsertRoleUserPopup;