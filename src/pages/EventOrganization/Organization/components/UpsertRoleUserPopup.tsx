import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useAddUserRolesMutation, useGetRolesByIdOrganizationQuery, useGetUserRoleDetailQuery } from "Apis/roleApi";
import { toastNotify } from "Helper";
import { apiResponse } from "Interfaces";
import roleModel from "Interfaces/roleModel";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";

interface UpsertRoleUserPopupProps {
  isOpen: boolean;
  toggleModal: () => void;
  userId: string;
}

function UpsertRoleUserPopup({ isOpen, toggleModal, userId }: UpsertRoleUserPopupProps) {
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);
  const { data: rolesData } = useGetRolesByIdOrganizationQuery(idOrganization);
  const { data: userRolesData } = useGetUserRoleDetailQuery(
    { userId: userId, organizationId: idOrganization },
    { skip: !userId }
  );
  const [updateUserRoles] = useAddUserRolesMutation();
  const [roles, setRoles] = useState<roleModel[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (userRolesData?.result) {
      setSelectedRoles(userRolesData.result);
    }
  }, [userRolesData]);

  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData.result);
    }
  }, [rolesData]);

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
      IdRoles: selectedRoles,
    };
    const res: apiResponse = await updateUserRoles(tempData);
    if (res.data?.isSuccess) {
      toastNotify("Update role success", "success");
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedRoles([]);
    toggleModal();
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle>Update User Roles</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Select roles to assign:
        </Typography>
        <Box>
          {roles.map((role) => (
            <FormControlLabel
              key={role.id}
              control={
                <Checkbox
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                />
              }
              label={role.name}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdateRole} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpsertRoleUserPopup;
