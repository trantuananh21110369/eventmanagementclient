import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { supportChatRoomModel } from "Interfaces";

interface chatSidebarProps {
  dataListChat: supportChatRoomModel[];
  selectedChat: supportChatRoomModel | null;
  onSelectChat: (chat: supportChatRoomModel) => void;
}

const ChatSidebar = ({ dataListChat, selectedChat, onSelectChat }: chatSidebarProps) => {
  return (
    <div className="h-full overflow-y-auto bg-gray-100">
      {/* Search input */}
      <div className="p-4">
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search Here..."
          className="bg-white"
        />
      </div>

      {/* Chat list */}
      <List>
        {dataListChat.map((chat) => (
          <ListItem
            key={chat.supportChatRoomId}
            onClick={() => onSelectChat(chat)}
            component="div" // Chỉ định rõ kiểu component
            style={{ cursor: "pointer" }} // Thêm CSS nếu cần
          >
            <ListItemAvatar>
              <Avatar alt="None" src={chat.user?.urlImage} />
            </ListItemAvatar>
            <ListItemText
              primary={chat.user?.fullName}
              secondary={`${chat.user?.email}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ChatSidebar;
