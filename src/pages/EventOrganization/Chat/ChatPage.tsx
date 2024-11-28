import React, { useEffect, useState } from "react";
import ChatSidebar from "./ChatSideBar";
import ChatMain from "./ChatMain";
import { useGetAllChatRoomByOrganizationIdQuery, useGetMessageByIdRoomQuery } from "Apis/supportChatApi";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";
import { supportChatRoomModel } from "Interfaces";
import messageModel from "Interfaces/SupportChat/messageModel";
import { hubService } from "Service/HubService";

function App() {
  const hubUrl = "https://localhost:7056/hubs/supportchat";
  const organizationId = useSelector((state: RootState) => state.organizationStore.idOrganization);
  const [connection, setConnection] = useState<any>();
  const [selectedChat, setSelectedChat] = useState<supportChatRoomModel | null>(null);
  const [dataMessage, setDataMessage] = useState<messageModel[]>([]);
  const [dataListRoom, setDataListRoom] = useState<supportChatRoomModel[]>([]);
  const { data: listChat, isFetching: isFetchingLC } = useGetAllChatRoomByOrganizationIdQuery(organizationId);
  const { data: listMessage, isFetching: isFetchingMessage } =
    useGetMessageByIdRoomQuery(selectedChat?.supportChatRoomId, { skip: !selectedChat?.supportChatRoomId })

  useEffect(() => {
    if (listChat) {
      setDataListRoom(listChat.result);
      setSelectedChat(listChat.result[0]);
    }
    console.log("listChat useEffect");
  }, [listChat])

  useEffect(() => {
    if (listMessage?.result) {
      setDataMessage(listMessage.result);
    }
    console.log("list message useEffect");
  }, [listMessage, selectedChat]);

  useEffect(() => {
    const setupConnection = async () => {
      try {
        const connection = await hubService.startConnection(hubUrl);
        connection.on("ReceiveMessage", (message: messageModel) => {
          console.log("ReceiveMessage", message);
          setDataMessage((prevMessages) => [...prevMessages, message]);
        });

        if (selectedChat?.supportChatRoomId) {
          await connection.invoke("JoinRoom", selectedChat.supportChatRoomId);
        }
        console.log("in chat page");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    setupConnection();

    return () => {
      hubService.stopConnection(hubUrl);
    };
  }, [selectedChat]);

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar bên trái */}
      <div className="h-full w-1/4 border-r bg-white">
        <ChatSidebar dataListChat={dataListRoom} onSelectChat={setSelectedChat} selectedChat={selectedChat} />
      </div>

      {/* Khung chat chính giữa */}
      <div className="flex-1">
        <ChatMain dataMessage={dataMessage}
          selectedChat={selectedChat} />
      </div>
    </div>
  );
}

export default App;