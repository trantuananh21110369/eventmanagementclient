import Time from "react-datepicker/dist/time";

export default interface EventDateModel {
  idEventDate: string; // Primary key
  dateTitle: string; // Tiêu đề ngày
  eventId: string; // ID của sự kiện liên quan
  scheduledDate: string; // Ngày dự kiến
  startTime: string; // Thời gian bắt đầu
  endTime: string; // Thời gian kết thúc
}
