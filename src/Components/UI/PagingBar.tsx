import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface PaginationProps {
  totalRecords: number;
}

function PagingBar({ totalRecords }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5"); // Đổi mặc định thành 5

  const totalPages = Math.ceil(totalRecords / pageSize);

  const getPageDetail = () => {
    const startRecord = (pageNumber - 1) * pageSize + 1;
    const endRecord = Math.min(pageNumber * pageSize, totalRecords);
    return `${startRecord}–${endRecord} of ${totalRecords}`;
  };

  const handlePageChange = (direction: "prev" | "next") => {
    const newPageNumber = direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    setSearchParams({
      pageNumber: newPageNumber.toString(),
      pageSize: pageSize.toString(),
    });
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams({
      pageNumber: "1", // Reset to page 1 when page size changes
      pageSize: size.toString(),
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={2}
      padding={2}
      flexWrap="wrap" // Ensure that elements wrap properly when zoomed in
      sx={{
        fontSize: "1rem", // Rem for better scalability
        maxWidth: "100%", // Ensure it doesn't overflow
        overflowY: "auto", // Add vertical scroll if content overflows
        height: "auto", // Let the container adjust its height based on content
      }}
    >
      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
        Rows per page:
      </Typography>
      <Select
        value={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        size="small"
        sx={{
          fontSize: "1rem", // Ensure the font size is consistent
          minWidth: "100px", // Set a minimum width to prevent shrinking too much
          maxWidth: "150px", // Set a maximum width to avoid excessive growth
        }}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select>

      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
        {getPageDetail()}
      </Typography>

      <IconButton
        onClick={() => handlePageChange("prev")}
        disabled={pageNumber === 1}
        sx={{
          fontSize: "1.5rem", // Keep icon size consistent
        }}
      >
        <ChevronLeft />
      </IconButton>

      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
        {pageNumber} / {totalPages}
      </Typography>

      <IconButton
        onClick={() => handlePageChange("next")}
        disabled={pageNumber * pageSize >= totalRecords}
        sx={{
          fontSize: "1.5rem", // Keep icon size consistent
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}

export default PagingBar;
