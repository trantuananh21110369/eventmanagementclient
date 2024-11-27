import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function FullScreenLoader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền đen mờ
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300, // Đảm bảo xuất hiện trên cùng
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
}
