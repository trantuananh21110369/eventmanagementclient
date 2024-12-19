import React, { useEffect, useRef, useState } from "react";
import ChatSidebar from "./ChatSideBar";
import ChatMain from "./ChatMain";
import { useLazyGetAllChatRoomByOrganizationIdQuery, useLazyGetMessageByIdRoomQuery } from "Apis/supportChatApi";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";
import { supportChatRoomModel } from "Interfaces";
import messageModel from "Interfaces/SupportChat/messageModel";
import { hubService } from "Service/HubService";
import { LoadingCircular } from "Components/UI";
import { toastNotify } from "Helper";


function App() {
  const hubUrl = "https://localhost:7056/hubs/supportchat";
  const connectionRef = useRef<any>(null);
  const userId = useSelector((state: RootState) => state.userAuthStore.id);

  const organizationId = useSelector((state: RootState) => state.organizationStore.idOrganization);
  const [selectedChat, setSelectedChat] = useState<supportChatRoomModel | null>(null);
  const [dataMessage, setDataMessage] = useState<messageModel[]>([]);
  const [dataListRoom, setDataListRoom] = useState<supportChatRoomModel[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const [getAllChatRooms, { data: listChat, error: errorListChat, isFetching: isFetchingRooms }] = useLazyGetAllChatRoomByOrganizationIdQuery();
  const [getAllMessages, { data: listMessage, isFetching: isFetchingMessage }] = useLazyGetMessageByIdRoomQuery();
  useEffect(() => {
    const setupConnection = async () => {
      if (connectionRef.current) {
        console.log("Kết nối đã tồn tại.");
        return;
      }

      try {
        // Thiết lập kết nối mới
        const connection = await hubService.startConnection(hubUrl);
        connectionRef.current = connection;
        setIsConnected(true);

        // Lắng nghe sự kiện từ server
        connection.on("ReceiveMessage", (message: messageModel) => {
          setDataMessage((prevMessages) => [...prevMessages, message]);
        });

        connection.on("ReceiveChatRoom", (supportChatRoom: supportChatRoomModel) => {
          setDataListRoom((prevListChatRoom) => {
            // Kiểm tra xem phòng chat đã tồn tại chưa
            const existingRoomIndex = prevListChatRoom.findIndex(
              (room) => room.supportChatRoomId === supportChatRoom.supportChatRoomId
            );

            if (existingRoomIndex !== -1) {
              // Nếu tồn tại, di chuyển lên đầu
              const updatedList = [...prevListChatRoom];
              const [existingRoom] = updatedList.splice(existingRoomIndex, 1);
              return [existingRoom, ...updatedList];
            }

            // Nếu chưa tồn tại, thêm mới
            return [supportChatRoom, ...prevListChatRoom];
          });
        });

        // Tham gia phòng chat hiện tại nếu có
        if (selectedChat?.supportChatRoomId) {
          await connection.invoke("JoinRoom", selectedChat?.supportChatRoomId);
        }

        console.log("Kết nối thành công");
        getAllChatRooms(organizationId);
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    setupConnection();

    // Cleanup khi component unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current.off("ReceiveMessage");
        connectionRef.current.off("ReceiveChatRoom");
        console.log("Đã dừng kết nối SignalR.");
      }
      connectionRef.current = null;
      setIsConnected(false);
      setDataMessage([]);
    };
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    if (listChat && !isFetchingRooms) {
      setDataListRoom(listChat.result);
      handleSelectChat(listChat.result[0]);
    }

    if (errorListChat) {
      if ('status' in errorListChat && errorListChat.status === 403) {
        toastNotify("You don't have permission", "error");
      }
    }

  }, [listChat, errorListChat])

  useEffect(() => {
    if (listMessage && !isFetchingMessage) {
      setDataMessage(listMessage.result);
    }
  }, [isFetchingMessage])

  const handleSelectChat = async (chat: supportChatRoomModel) => {
    try {
      setSelectedChat(chat);

      if (connectionRef.current) {
        await connectionRef.current.invoke("JoinRoom", chat.supportChatRoomId);
        await connectionRef.current.invoke("MarkAsMessage", chat.supportChatRoomId);

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


  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar bên trái */}
      <div className="h-full w-1/4 border-r bg-white">
        {
          isFetchingRooms ? (<LoadingCircular />) :
            (<ChatSidebar dataListChat={dataListRoom} onSelectChat={handleSelectChat} selectedChat={selectedChat} />)
        }
      </div>

      {/* Khung chat chính giữa */}
      <div className="flex-1">
        {isFetchingMessage ? (<LoadingCircular />
        ) :
          (<ChatMain dataMessage={dataMessage}
            selectedChat={selectedChat}
            connectionRef={connectionRef} />)}
      </div>

    </div >
  );
}

export default App;