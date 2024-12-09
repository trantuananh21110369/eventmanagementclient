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

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define data type for TicketStatisticDto
interface TicketStatisticDto {
  ticketName: string;
  soldQuantity: number;
  remainingQuantity: number;
  totalRevenue: number;
}

const EventOverview: React.FC = () => {
  const { idEvent } = useParams();
  const { data, isFetching } = useGetReportEventQuery({ idEvent: idEvent });

  // Initialize state to store ticket statistics data
  const [ticketStats, setTicketStats] = useState<TicketStatisticDto[]>([]);
  const [totalOrder, setTotalOrder] = useState<number>(0);

  // Update data when API returns results
  useEffect(() => {
    if (data?.result) {
      setTicketStats(data.result.ticketStatistics);
      setTotalOrder(data.result.totalOrder);
      console.log(data.result);
    }
  }, [data]);

  // Check if data is still loading
  if (isFetching) {
    return <Typography>Loading...</Typography>;
  }

  // Choose colors for the chart (automatically change colors if there are more than 3 tickets)
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
        Event Overview
      </Typography>

      {/* Overview Information */}
      <Grid container spacing={4} className="mb-6">
        {[
          { title: "Total Tickets Sold", value: `${ticketStats.reduce((acc, ticket) => acc + ticket.soldQuantity, 0)} tickets` },
          { title: "Event Revenue", value: `${ticketStats.reduce((acc, ticket) => acc + ticket.totalRevenue, 0).toLocaleString()} $` },
          { title: "Total Orders", value: `${totalOrder} orders` },
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

      {/* Detailed Statistics */}
      <Typography variant="h5" gutterBottom className="text-gray-800">
        Ticket Statistics
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg border rounded-xl bg-white">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-gray-800 font-medium">
                Tickets Sold Chart
              </Typography>
              <Doughnut data={chartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="shadow-lg border rounded-xl bg-white">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-gray-800 font-medium">
                Tickets Sold Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket Name</TableCell>
                      <TableCell align="right">Quantity Sold</TableCell>
                      <TableCell align="right">Revenue ($)</TableCell>
                      <TableCell align="right">Remaining Tickets</TableCell>
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
