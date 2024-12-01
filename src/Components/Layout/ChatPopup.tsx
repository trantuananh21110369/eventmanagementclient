import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useGetAllChatRoomByUserIdQuery, useGetMessageByIdRoomQuery, useSendMessageMutation } from "Apis/supportChatApi";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";
import { apiResponse, supportChatRoomModel } from "Interfaces";
import messageModel from "Interfaces/SupportChat/messageModel";
import { hubService } from "Service/HubService";

interface ChatPopupProps {
  open: boolean;
  handleClose: () => void;
}

interface sendMessageModel {
  senderId: string;
  roomId: string;
  content: string;
  isSupport: boolean;
}

const ChatPopup = ({ open, handleClose }: ChatPopupProps) => {
  const connectionRef = useRef<any>(null);
  const fetchRoomCount = useRef<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const [sendMessage] = useSendMessageMutation();

  const [dataListRoom, setDataListRoom] = useState<supportChatRoomModel[]>([]);
  const [selectedChat, setSelectedChat] = useState<supportChatRoomModel | null>(null);
  const [dataMessage, setDataMessage] = useState<messageModel[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  // Get chat rooms list
  const { data: listChat, isFetching: isFetchingRooms, refetch: refecthRooms } = useGetAllChatRoomByUserIdQuery(userId, {
    skip: !isConnected,
  });

  // Get messages of the selected chat room
  const { data: listMessage, isFetching: isFetchingMessage, refetch: refecthMessage } = useGetMessageByIdRoomQuery(
    selectedChat?.supportChatRoomId,
    {
      skip: !selectedChat?.supportChatRoomId,
    }
  );

  const hubUrl = "https://localhost:7056/hubs/supportchat";

  useEffect(() => {
    const setupConnection = async () => {
      try {
        const connection = await hubService.startConnection(hubUrl);
        connectionRef.current = connection;
        setIsConnected(true);
        connection.on("ReceiveMessage", (message: messageModel) => {
          console.log("New Message: ", message);
          setDataMessage((prevMessages) => [...prevMessages, message]);
        });

        if (selectedChat?.supportChatRoomId) {
          await connection.invoke("JoinRoom", selectedChat.supportChatRoomId);
        }

        refecthRooms();
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    if (open) {
      setupConnection();
    }

    return () => {
      hubService.stopConnection(hubUrl);
      setDataMessage([]);
      setIsConnected(false);
    };
  }, [open]); // Khởi tạo kết nối khi popup mở lại

  useEffect(() => {
    if (listChat) {
      console.log("lay phong moi")
      setDataListRoom(listChat.result);
      setSelectedChat({ ...listChat.result[0] });
      if (fetchRoomCount.current > 0) {
        refecthMessage();
      }
      fetchRoomCount.current++;
    }
  }, [isFetchingRooms, isConnected]);

  useEffect(() => {
    if (listMessage) {
      console.log("lay hoi thoai moi")
      setDataMessage(listMessage.result);
    }
  }, [isFetchingMessage, selectedChat]);

  const handleSelectChat = async (chat: supportChatRoomModel) => {
    if (connectionRef.current && selectedChat?.supportChatRoomId) {
      await connectionRef.current.invoke("LeaveRoom", selectedChat.supportChatRoomId);
    }
    setSelectedChat(chat);
    if (connectionRef.current) {
      await connectionRef.current.invoke("JoinRoom", chat.supportChatRoomId);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: sendMessageModel = {
      senderId: userId,
      roomId: selectedChat?.supportChatRoomId || "",
      content: inputMessage,
      isSupport: false,
    };

    const response: apiResponse = await sendMessage({ sendMessage: formData });
    if (response.data?.isSuccess) {
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dataMessage]); // Scroll đến cuối mỗi khi có tin nhắn mới

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Box display="flex" height="400px">
          <Box width="30%" bgcolor="whitesmoke" overflow="auto" borderRight="1px solid #ddd">
            <Box padding={2}>
              <TextField fullWidth variant="outlined" size="small" placeholder="Search Here..." />
            </Box>
            <List>
              {dataListRoom.map((chat, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleSelectChat(chat)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: chat.organizationId === selectedChat?.organizationId ? "#e0f7fa" : "transparent",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>Chưa có</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.organization?.nameOrganization}
                    secondary={`${chat.organization?.country} - ${chat.organization?.city}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box flexGrow={1} padding={2}>
            <Typography variant="h6" gutterBottom>
              {selectedChat?.organization?.nameOrganization || "No Chat Selected"}
            </Typography>
            <Box height="300px" overflow="auto" bgcolor="#f9f9f9" padding={2} border="1px solid #ddd" borderRadius={2}>
              {dataMessage.length ? (
                dataMessage.map((message, index) => (
                  <div key={index} className={`flex flex-col ${message.isSupport ? 'items-start' : 'items-end'}`}>
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

            <Box marginTop={2} display="flex" alignItems="center">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Write a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPopup;
