import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useGetReportEventQuery } from "Apis/eventApi";
import { useParams } from "react-router-dom";

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Định nghĩa kiểu dữ liệu cho TicketStatisticDto
interface TicketStatisticDto {
  ticketName: string;
  soldQuantity: number;
  remainingQuantity: number;
  totalRevenue: number;
}

const EventOverview: React.FC = () => {
  const { idEvent } = useParams();
  const { data, isFetching } = useGetReportEventQuery({ idEvent: idEvent });

  // Khởi tạo state để lưu trữ dữ liệu thống kê vé
  const [ticketStats, setTicketStats] = useState<TicketStatisticDto[]>([]);
  const [totalOrder, setTotalOrder] = useState<number>(0);

  // Cập nhật dữ liệu khi API trả về kết quả
  useEffect(() => {
    if (data?.result) {
      setTicketStats(data.result.ticketStatistics);
      setTotalOrder(data.result.totalOrder);
      console.log(data.result);
    }
  }, [data]);

  // Kiểm tra nếu dữ liệu chưa được tải
  if (isFetching) {
    return <Typography>Loading...</Typography>;
  }

  // Chọn màu cho biểu đồ (tự động thay đổi màu nếu có nhiều hơn 3 vé)
  const colorPalette: string[] = [
    "#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#00bcd4", "#ff5722", "#607d8b", "#8bc34a",
    "#795548", "#3f51b5", "#ffc107", "#e91e63"
  ];

  const chartData = {
    labels: ticketStats.map((ticket) => ticket.ticketName),
    datasets: [
      {
        data: ticketStats.map((ticket) => ticket.soldQuantity),
        backgroundColor: ticketStats.map((_, index) => colorPalette[index % colorPalette.length]),
        hoverBackgroundColor: ticketStats.map((_, index) => colorPalette[(index + 1) % colorPalette.length]),
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h4" align="center" gutterBottom className="font-bold text-gray-800">
        Tổng quan sự kiện
      </Typography>

      {/* Thông tin tổng quan */}
      <Grid container spacing={4} className="mb-6">
        {[
          { title: "Tổng số vé đã bán", value: `${ticketStats.reduce((acc, ticket) => acc + ticket.soldQuantity, 0)} vé` },
          { title: "Doanh thu từ sự kiện", value: `${ticketStats.reduce((acc, ticket) => acc + ticket.totalRevenue, 0).toLocaleString()} VND` },
          { title: "Tổng số đơn hàng", value: `${totalOrder} đơn hàng` },
        ].map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card className="shadow-lg border rounded-xl bg-white">
              <CardContent>
                <Typography variant="h6" className="text-gray-800 font-medium">
                  {item.title}
                </Typography>
                <Typography variant="h5" className="text-gray-900 mt-2 font-bold">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Thống kê chi tiết */}
      <Typography variant="h5" gutterBottom className="text-gray-800">
        Thống kê theo vé
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg border rounded-xl bg-white">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-gray-800 font-medium">
                Biểu đồ vé bán được
              </Typography>
              <Doughnut data={chartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="shadow-lg border rounded-xl bg-white">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-gray-800 font-medium">
                Chi tiết vé bán được
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên vé</TableCell>
                      <TableCell align="right">Số lượng bán</TableCell>
                      <TableCell align="right">Doanh thu ($)</TableCell>
                      <TableCell align="right">Vé còn lại</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticketStats.map((ticket, index) => (
                      <TableRow key={index}>
                        <TableCell>{ticket.ticketName}</TableCell>
                        <TableCell align="right">{ticket.soldQuantity}</TableCell>
                        <TableCell align="right">{ticket.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell align="right">{ticket.remainingQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default EventOverview;
