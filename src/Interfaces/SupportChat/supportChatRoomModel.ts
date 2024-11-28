import organizationModel from "Interfaces/organizationModel";

export default interface supportChatRoomModel {
  supportChatRoomId: string;
  organizationId: string;
  organization: organizationModel;
  userId: string;
  user: userModel;
  name: string;
}

interface userModel {
  fullName: string;
  email: string;
}
