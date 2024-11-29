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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const refCountFetch = useRef<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const [sendMessage] = useSendMessageMutation();

  const [dataListRoom, setDataListRoom] = useState<supportChatRoomModel[]>([]);
  const [selectedChat, setSelectedChat] = useState<supportChatRoomModel | null>(null);
  const [dataMessage, setDataMessage] = useState<messageModel[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const { data: listChat, isFetching: isFetchingRooms, refetch: refecthChatRoom } = useGetAllChatRoomByUserIdQuery(userId, {
    skip: !isConnected, // Chỉ lấy dữ liệu khi đã kết nối
  });

  const { data: listMessage, isFetching: isFetchingMessage, refetch: refetchMessage } = useGetMessageByIdRoomQuery(
    selectedChat?.supportChatRoomId, { skip: !selectedChat?.supportChatRoomId });

  const hubUrl = "https://localhost:7056/hubs/supportchat";
  // console.log("2 isconnected out " + isConnected)
  // console.log("datalist " + listChat?.result + "Isfetching" + isFetchingRooms)
  // console.log("messagelist " + listMessage?.result + "IsFetching" + isFetchingMessage)
  useEffect(() => {
    // Chỉ gọi refetch nếu query đã hoàn tất và có dữ liệu
    if (isConnected && !isFetchingRooms) {
      refecthChatRoom();
    }
  }, [isConnected]);

  useEffect(() => {
    console.log("3")
    const setupConnection = async () => {
      try {
        const connection = await hubService.startConnection(hubUrl);
        connectionRef.current = connection;
        setIsConnected(true);

        connection.on("ReceiveMessage", (message: messageModel) => {
          setDataMessage((prevMessages) => [...prevMessages, message]);
        });

        if (selectedChat?.supportChatRoomId) {
          await connection.invoke("JoinRoom", selectedChat.supportChatRoomId);
        }
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
  }, [open]);

  useEffect(() => {
    console.log("1")
    if (listChat) {
      setDataListRoom(listChat.result);
      console.log(listChat.result[0])
      setSelectedChat({ ...listChat.result[0] }); // Tạo một bản sao, khiến tham chiếu thay đổi.
    }
  }, [isFetchingRooms, isConnected]);

  useEffect(() => {
    console.log("2")
    if (selectedChat?.supportChatRoomId && listMessage) {
      console.log("Vao trong duoclist roi")
      setDataMessage(listMessage.result); // Gán tin nhắn thay vì append
    }
  }, [isFetchingMessage, selectedChat]);

  useEffect(() => {
    // Chỉ gọi refetchMessage nếu selectedChat đã có supportChatRoomId
    console.log("Vao trong duoc roi  2")

    console.log(selectedChat?.supportChatRoomId)
    if (selectedChat?.supportChatRoomId) {
      console.log("Goi refetch  ")
      refetchMessage();  // Gọi lại query để lấy tin nhắn cho phòng chat mới
    }
  }, [selectedChat]);  // Chạy lại khi selectedChat thay đổi

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
  }, [dataMessage]);

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
