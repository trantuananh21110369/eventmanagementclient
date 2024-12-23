import React, { useEffect, useState, useCallback } from "react";
import {
  useAddRoleMutation,
  useGetPermissionsQuery,
  useGetRoleDetailQuery,
  useUpdateRoleMutation,
} from "Apis/roleApi";
import { inputHepler, toastNotify } from "Helper";
import { apiResponse } from "Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

interface UpsertRoleModalProps {
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
  claimValues: [],
};

function UpsertRolePopup({ isOpen, toggleModal, roleId }: UpsertRoleModalProps) {
  const { data: permissionData } = useGetPermissionsQuery({});
  const { data: roleDetailData } = useGetRoleDetailQuery(roleId, {
    skip: !roleId,
  });
  const idOrganization = useSelector(
    (state: RootState) => state.organizationStore.idOrganization
  );
  const [addRole] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [input, setInput] = useState<RoleOrganization>(defaultRoleOrganization);

  useEffect(() => {
    if (roleDetailData?.result) {
      const tempData: RoleOrganization = {
        roleId: roleDetailData.result.roleId || "",
        nameRole: roleDetailData.result.nameRole || "",
        description: roleDetailData.result.description || "",
        organizationId: roleDetailData.result.organizationId || "",
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

  const handleEventInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput((prev) => inputHepler(e, prev));
    },
    []
  );

  const handlePermissionChange = useCallback((permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  }, []);

  const handleCreateOrUpdateRole = useCallback(async () => {
    if (!input.nameRole.trim()) {
      toastNotify("Role name cannot be empty", "error");
      return;
    }

    const newRole: RoleOrganization = {
      ...input,
      organizationId: idOrganization,
      claimValues: selectedPermissions,
    };

    const response: apiResponse = roleId
      ? await updateRole({ roleId, data: newRole })
      : await addRole(newRole);

    if (response.data?.isSuccess) {
      toastNotify(
        roleId ? "Update role success" : "Create role success",
        "success"
      );
      handleCloseModal();
    }
  }, [input, selectedPermissions, roleId, idOrganization]);

  const handleCloseModal = useCallback(() => {
    toggleModal();
    setInput(defaultRoleOrganization);
    setSelectedPermissions([]);
  }, [toggleModal]);

  return (
    <Dialog open={isOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle>{roleId ? "Update Role" : "Create Role"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Role Name"
          name="nameRole"
          value={input.nameRole}
          onChange={handleEventInput}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={input.description}
          onChange={handleEventInput}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <div className="mt-3">Choose your Permissions</div>
        <div>
          {permissions.map((permission) => (
            <FormControlLabel
              key={permission}
              control={
                <Checkbox
                  checked={selectedPermissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                />
              }
              label={permission}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleCreateOrUpdateRole}
          variant="contained"
          color="primary"
        >
          {roleId ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpsertRolePopup;
