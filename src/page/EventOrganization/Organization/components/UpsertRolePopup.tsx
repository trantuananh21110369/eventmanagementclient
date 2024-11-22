import { useAddRoleMutation, useGetPermissionsQuery, useGetRoleDetailQuery, useUpdateRoleMutation } from 'Apis/roleApi';
import { inputHepler, toastNotify } from 'Helper';
import { apiResponse } from 'Interfaces';
import { useEffect, useState } from 'react';
import { set } from 'react-datepicker/dist/date_utils';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { RootState } from 'Storage/Redux/store';

interface CreateRoleModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  roleId: string;
}

interface RoleOrganization {
  roleId: string;
  nameRole: string;
  organizationId: string;
  description: string;
  claimValues: string[];
}

const defaultRoleOrganization: RoleOrganization = {
  roleId: "",
  nameRole: "",
  organizationId: "",
  description: "",
  claimValues: [] // Mảng string
};

function UpsertRolePopup({
  isOpen,
  toggleModal,
  roleId,
}: CreateRoleModalProps) {
  const { data: permissionData, isFetching: isFetchingPermission } = useGetPermissionsQuery({});
  const { data: roleDetailData, isFetching: isFetchingRole } = useGetRoleDetailQuery(
    roleId,
    { skip: !permissionData } // Nếu permissionData chưa có, không gọi useGetRoleDetailQuery
  );
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);
  const [addRole] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [input, setInput] = useState<RoleOrganization>(defaultRoleOrganization);

  useEffect(() => {
    if (roleDetailData?.result) {
      const tempData: RoleOrganization = {
        roleId: roleDetailData.result.roleId || '',
        nameRole: roleDetailData.result.nameRole || '',
        description: roleDetailData.result.description || '',
        organizationId: roleDetailData.result.organizationId || '',
        claimValues: roleDetailData.result.claimValues || [],
      };
      setInput(tempData);
      setSelectedPermissions(tempData.claimValues);
    }
  }, [roleDetailData]);

  useEffect(() => {
    if (permissionData) {
      setPermissions(permissionData.result);
    }
  }, [permissionData]);

  // handle UI input changes
  const handleEventInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const tempData = inputHepler(e, input);
    setInput(tempData);
  };

  // handle permission selection
  const handlePermissionChange = (permission: string) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  // handle create role
  const handleCreateRole = async () => {
    const newRole: RoleOrganization = {
      ...input,
      organizationId: idOrganization,
      claimValues: selectedPermissions,
    };

    //Create Role
    if (roleId === "") {
      const response: apiResponse = await addRole(newRole);
      if (response.data?.isSuccess) {
        toastNotify("Create role success", "success");
        handleCloseModal();
      }
    }
    //Update Role
    else {
      const response: apiResponse = await updateRole({ roleId, data: newRole });
      if (response.data?.isSuccess) {
        toastNotify("Update role success", "success");
        handleCloseModal();
      }
    }
  };

  const handleCloseModal = () => {
    toggleModal();
    setInput((x) => ({
      roleId: "",
      nameRole: "",
      organizationId: "",
      description: "",
      claimValues: [] as string[],
    }));
    setSelectedPermissions([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      ariaHideApp={false}
    >
      <h3 className="text-xl font-bold mb-4">Create Role</h3>
      <div className="mb-3">
        <label className="block mb-1 text-gray-700">Role Name</label>
        <input
          type="text"
          name="nameRole"
          value={input.nameRole}
          onChange={handleEventInput}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter role name"
        />
      </div>

      {/* Permission Selection */}
      <div className="mb-3">
        <label className="block mb-1 text-gray-700">Permissions</label>
        {permissions.map((permission) => (
          <div key={permission} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={permission}
              checked={selectedPermissions.includes(permission)}
              onChange={() => handlePermissionChange(permission)}
              className="mr-2"
            />
            <label htmlFor={permission} className="text-gray-800">
              {permission}
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
          onClick={handleCreateRole}
        >
          {roleId === "" ? "Create" : "Update"} {/* Kiểm tra điều kiện */}
        </button>
      </div>
    </Modal>
  );
};

export default UpsertRolePopup;
