import React from 'react';
import { Lock } from '@mui/icons-material'; // Thêm icon khóa từ Material UI

function PrivatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gradient-to-r from-primary via-yellow-500 to-red-500 text-second text-gray-700 p-12 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center items-center mb-4">
          <Lock className="text-6xl mr-4" /> {/* Icon khóa */}
          <h2 className="text-3xl font-semibold">Event is Private</h2>
        </div>
        <p className="text-lg">This event is restricted to authorized participants only.</p>
      </div>
    </div>
  );
}

export default PrivatePage;
