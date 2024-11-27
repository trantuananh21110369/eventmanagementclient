import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useGetPurchasedTicketByIdQuery, useSavePurchasedTicketByIdMutation } from 'Apis/purchasedTicketApi';
import { apiResponse, purchasedTicketModel } from 'Interfaces';
import { inputHepler } from 'Helper';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface PurchasedTicketPopupProps {
  PurchasedTicketId: string;
  isOpen: boolean;
  isOrganization: boolean;
  handleClose: () => void;
}

interface inputPurchasedTicket {
  fullName: string;
  email: string;
  phone: string;
  status: string;  //Combobox
}

function PurchasedTicketPopup({ PurchasedTicketId, handleClose, isOpen, isOrganization = false }: PurchasedTicketPopupProps) {
  const { data, isFetching } = useGetPurchasedTicketByIdQuery(PurchasedTicketId);
  const [updatePT] = useSavePurchasedTicketByIdMutation();
  const [dataPurchasedTicket, setDataPurchasedTicket] = React.useState<purchasedTicketModel>();
  const [input, setInput] = useState<inputPurchasedTicket>({
    fullName: '',
    email: '',
    phone: '',
    status: ''
  });

  React.useEffect(() => {
    if (data) {
      setDataPurchasedTicket(data.result);
      setInput({
        fullName: data.result.fullName,
        email: data.result.email,
        phone: data.result.phone,
        status: data.result.status
      });
    }
  }, [data]);

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHepler(e, input);
    setInput(tempData);
  };

  const handleSave = async () => {
    const rs: apiResponse = await updatePT({ idPurchasedTicket: PurchasedTicketId, data: { ...input } });
    handleClose();
  }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Purchased Ticket Details
          </Typography>
          {isFetching ? (
            <Typography sx={{ mt: 2 }}>Loading...</Typography>
          ) : dataPurchasedTicket ? (
            <Box sx={{ mt: 2 }}>
              <TextField
              label="Full Name"
              name="fullName"
              value={input.fullName}
              onChange={handleInput}
              fullWidth
              margin="normal"
              />
              <TextField
              label="Email"
              name="email"
              value={input.email}
              onChange={handleInput}
              fullWidth
              margin="normal"
              />
              <TextField
              label="Phone"
              name="phone"
              value={input.phone}
              onChange={handleInput}
              fullWidth
              margin="normal"
              />
              {isOrganization && (
              <TextField
                select
                label="Status"
                name="status"
                value={input.status}
                onChange={handleInput}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
              )}
            </Box>
          ) : (
            <Typography sx={{ mt: 2 }}>No data available</Typography>
          )}
          <Button onClick={handleSave} sx={{ mt: 2 }}>Save</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default PurchasedTicketPopup;
