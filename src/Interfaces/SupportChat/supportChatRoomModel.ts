import organizationModel from "Interfaces/organizationModel";

export default interface supportChatRoomModel {
  supportChatRoomId?: string;
  organizationId?: string;
  organization?: organizationModel;
  userId?: string;
  user?: userModel;
  name?: string;
  isReadFromUser?: number;
  isReadFromOrganizaiton?: number;
}

interface userModel {
  fullName?: string;
  email?: string;
  urlImage?: string;
}
