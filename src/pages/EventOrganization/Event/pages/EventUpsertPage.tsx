import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import SidebarUpsertEvent from '../components/SidebarUpsertEvent'; 

function EventUpsertPage() { 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  return ( 
    <div className="relative h-full flex">
      {/* Sidebar */}
      <SidebarUpsertEvent 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        className="z-20" // Set z-index of sidebar higher
      />
      
      {/* Main Content */}
      <div 
        className={`flex-grow overflow-x-auto p-10 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-[20px]' : 'lg:ml-0'
        } relative`}
      >
        {/* Outlet */}
        <Outlet />

        {/* Overlay (only visible on mobile when sidebar is open) */}
        {isSidebarOpen && (
          <div className="lg:hidden absolute inset-0 bg-gray-900 opacity-100 z-10" onClick={toggleSidebar}></div>
        )}
      </div>

      {/* Button to toggle sidebar (for mobile only) */}
      <span
        className="absolute text-white top-20 -left-2 cursor-pointer bg-red-900 hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center p-2 rounded-full shadow-lg hover:shadow-xl lg:hidden"
        onClick={toggleSidebar}
      >
        {/* FontAwesome Icon with rotation effect */}
        <i className={`bi ${isSidebarOpen ? 'bi-arrow-left-circle' : 'bi-arrow-right-circle'} transition-transform duration-500 ease-in-out transform ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`}></i> 
      </span>
    </div>
  );
}

export default EventUpsertPage;
