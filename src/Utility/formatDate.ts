export function formatDateTime(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const result = `${year}-${month}-${day} ${hours}:${minutes}`;
  return result;
}
