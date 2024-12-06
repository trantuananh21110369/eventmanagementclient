import React, { useEffect, useRef, useState } from "react";
import { Avatar, TextField, IconButton, Box, Typography, ListItemText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import messageModel from "Interfaces/SupportChat/messageModel";
import { apiResponse, supportChatRoomModel } from "Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";
import { useSendMessageMutation } from "Apis/supportChatApi";

interface chatSidebarProps {
  dataMessage: messageModel[];
  selectedChat: supportChatRoomModel | null;
  connectionRef: any;
}

interface sendMessageModel {
  senderId: string;
  roomId: string;
  content: string;
  isSupport: boolean;
}


const ChatMain = ({ dataMessage, selectedChat, connectionRef }: chatSidebarProps) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  // Make scroll down
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useSelector((state: RootState) => state.userAuthStore.id);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dataMessage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: sendMessageModel = {
      senderId: userId,
      roomId: selectedChat?.supportChatRoomId || "",
      content: inputMessage,
      isSupport: true,
    };

    connectionRef.current.send("SendMessage", formData);
    setInputMessage("");
  };


  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-4 border-b space-x-2">
        <Avatar alt="None" src={selectedChat?.user?.urlImage} />
        <div>
          <ListItemText
            primary={selectedChat?.user?.fullName}
            secondary={`${selectedChat?.user?.email}`}
          />
        </div>
      </div>
      <Box height="300px" overflow="auto" bgcolor="#f9f9f9" padding={2} border="1px solid #ddd" borderRadius={2}>
        {dataMessage.length ? (
          dataMessage.map((message, index) => (
            <div key={index} className={`flex flex-col ${message.isSupport ? 'items-end' : 'items-start'}`}>
              <Typography variant="body2" className="bg-blue-300 rounded-full px-3 py-1">{message.content}</Typography>
              <Typography variant="caption" color="textSecondary" className="mx-3">{message.sendAt}</Typography>
            </div>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No messages available.
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <div className="p-4 border-t flex items-center">
        <TextField
          fullWidth
          placeholder="Write something..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <IconButton onClick={handleSendMessage}>
          <SendIcon color="primary" />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatMain;
