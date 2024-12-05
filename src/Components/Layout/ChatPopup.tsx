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
import {
  useCreateChatRoomMutation, useGetChatRoomByOrganizationIdQuery, useLazyGetAllChatRoomByUserIdQuery,
  useLazyGetMessageByIdRoomQuery, useSendMessageMutation
} from "Apis/supportChatApi";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";
import { apiResponse, supportChatRoomModel } from "Interfaces";
import messageModel from "Interfaces/SupportChat/messageModel";
import { hubService } from "Service/HubService";
import { toastNotify } from "Helper";

interface ChatPopupProps {
  open: boolean;
  handleClose: () => void;
  organizationId: string | undefined;
}

interface SendCreateChatRoomDto {
  organizationId?: string;
  senderId?: string;
  content?: string;
}

interface sendMessageModel {
  senderId: string;
  roomId: string;
  content: string;
  isSupport: boolean;
}

const ChatPopup = ({ open, handleClose, organizationId }: ChatPopupProps) => {
  const hubUrl = "https://localhost:7056/hubs/supportchat";
  const connectionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  //Api
  const [sendMessage] = useSendMessageMutation();
  const [createChatRoom] = useCreateChatRoomMutation();

  const [dataListRoom, setDataListRoom] = useState<supportChatRoomModel[]>([]);
  const [selectedChat, setSelectedChat] = useState<supportChatRoomModel | null>(null);
  const [dataMessage, setDataMessage] = useState<messageModel[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const [getAllChatRooms, { data: listChat, isFetching: isFetchingRooms }] = useLazyGetAllChatRoomByUserIdQuery();
  const [getAllMessages, { data: listMessage, isFetching: isFetchingMessage }] = useLazyGetMessageByIdRoomQuery();
  const { data: chatRoom, isFetching: isFetchingRoom } = useGetChatRoomByOrganizationIdQuery({ organizationId: organizationId, senderId: userId });

  //Ket noi voi hub khi popup mở
  useEffect(() => {
    const setupConnection = async () => {
      try {
        const connection = await hubService.startConnection(hubUrl);
        connectionRef.current = connection;
        setIsConnected(true);
        connection.on("ReceiveMessage", (message: messageModel) => {
          setDataMessage((prevMessages) => [...prevMessages, message]);
        });

        connection.on("ReceiveChatRoom", (supportChatRoom: supportChatRoomModel) => {
          setDataListRoom((prevListChatRoom) => {
            // Tìm phòng chat trùng
            const existingRoomIndex = prevListChatRoom.findIndex(
              (room) => room.supportChatRoomId === supportChatRoom.supportChatRoomId
            );

            if (existingRoomIndex !== -1) {
              // Nếu tồn tại, di chuyển lên đầu
              const updatedList = [...prevListChatRoom];
              const [existingRoom] = updatedList.splice(existingRoomIndex, 1); // Loại bỏ phòng chat cũ
              return [existingRoom, ...updatedList];
            }

            // Nếu chưa tồn tại, thêm mới
            return [supportChatRoom, ...prevListChatRoom];
          });
        });

        if (selectedChat?.supportChatRoomId) {
          await connection.invoke("JoinRoom", selectedChat.supportChatRoomId);
        }

        console.log("Ket noi thanh cong");
        getAllChatRooms(userId);
        console.log(chatRoom.data);
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

  //Lay danh sach phong
  useEffect(() => {
    if (listChat && !isFetchingRooms) {
      setDataListRoom(() => (listChat.result));
      getAllMessages(selectedChat?.supportChatRoomId);
      if (organizationId) {
        if (chatRoom?.result) {
          console.log("Organization da ton tai");
          handleSelectChat(chatRoom.result);
        }
        else {
          const emptyRoom: supportChatRoomModel = { organizationId: organizationId }
          setSelectedChat(emptyRoom);
        }
      }
      else {
        console.log("Organization lay lai tu danh sach phong");
        handleSelectChat({ ...listChat.result[0] });
      }
    }
  }, [isFetchingRooms, isConnected]);

  useEffect(() => {
    if (listMessage) {
      console.log("lay hoi thoai moi")
      setDataMessage(listMessage.result);
    }
  }, [isFetchingMessage, selectedChat]);

  const handleSelectChat = async (chat: supportChatRoomModel) => {
    try {
      setSelectedChat(chat);

      if (connectionRef.current) {
        // Tham gia phòng chat
        await connectionRef.current.invoke("JoinRoom", chat.supportChatRoomId);

        // Đánh dấu tin nhắn trong phòng là đã đọc
        await connectionRef.current.invoke("MarkAsMessage", chat.supportChatRoomId);

        // Cập nhật danh sách các phòng chat
        setDataListRoom((prevListChatRoom) =>
          prevListChatRoom.map((room) =>
            room.supportChatRoomId === chat.supportChatRoomId
              ? { ...room, isReadFromUser: 1 } // Cập nhật trạng thái đã đọc
              : room
          )
        );
        getAllMessages(chat.supportChatRoomId);
      }
    } catch (error) {
      console.error("Error handling chat selection:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    let rsChatRoomId: string = "";
    if (organizationId && !selectedChat?.supportChatRoomId) {
      const form = new FormData();
      form.append("organizationId", organizationId);
      form.append("senderId", userId);
      form.append("content", inputMessage);

      const response: apiResponse = await createChatRoom({ sendCreateChatRoom: form });
      if (response.data?.isSuccess) {
        rsChatRoomId = response.data.result.supportChatRoomId
        await handleSelectChat(response.data.result);
      }
    }
    if (selectedChat?.supportChatRoomId || rsChatRoomId) {

      const formData: sendMessageModel = {
        senderId: userId,
        roomId: selectedChat?.supportChatRoomId ?? rsChatRoomId,
        content: inputMessage,
        isSupport: false,
      };

      connectionRef.current.send("SendMessage", formData);
      setInputMessage("");
    }
  };

  // Scroll đến cuối mỗi khi có tin nhắn mới
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
                    backgroundColor: chat?.organizationId === selectedChat?.organizationId ? "#e0f7fa" : "transparent",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={chat?.organization?.urlImage} alt={chat?.organization?.nameOrganization} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        {chat?.organization?.nameOrganization}
                        {!chat?.isReadFromUser && (
                          <Box
                            component="span"
                            width={8}
                            height={8}
                            bgcolor="blue"
                            borderRadius="50%"
                            marginLeft={1}
                          />
                        )}
                      </Box>
                    }
                    secondary={`${chat?.organization?.country} - ${chat?.organization?.city}`}
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
