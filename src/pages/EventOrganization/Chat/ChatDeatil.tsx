import React from "react";
import { Avatar, Button } from "@mui/material";

const ChatDetails = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">D</Avatar>
        <p className="font-bold text-lg">Dianne Johnson</p>
        <p className="text-sm text-gray-500 mb-4">Junior Developer</p>
        <div className="flex gap-2 mb-4">
          <Button variant="outlined">Chat</Button>
          <Button variant="contained">Video Call</Button>
        </div>
      </div>
      <div>
        <p className="font-bold mb-2">Attachments</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outlined">PDF</Button>
          <Button variant="outlined">Video</Button>
          <Button variant="outlined">MP3</Button>
          <Button variant="outlined">Image</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
