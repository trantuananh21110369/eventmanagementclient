import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { RootState } from 'Storage/Redux/store';

function ManagementTicketPage() {
  const user = useSelector((state: RootState) => state.userAuthStore);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Trạng thái mở/đóng sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Đảo ngược trạng thái của sidebar
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 text-white fixed h-full shadow-lg z-20 sm:w-24 md:w-64 transition-transform duration-300 ${isSidebarOpen ? 'transform-none' : '-translate-x-full'
          } sm:translate-x-0`}
      >
        <div className="py-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
            <img
              src={user.urlImage || "https://placehold.co/600x400"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-center mt-4 font-bold text-lg">{user.fullName}</p>
        </div>

        <nav className="mt-6 space-y-4 px-6">
          <NavLink
            to="orders"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${isActive
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-600 hover:text-gray-100'
              }`
            }
          >
            Management Order
          </NavLink>
          {/* <NavLink
            to="like-event"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${isActive
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-600 hover:text-gray-100'
              }`
            }
          >
            Event Like
          </NavLink> */}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 p-6 bg-gray-100 ${isSidebarOpen ? 'ml-64' : 'ml-16'
          } sm:ml-64`} // Điều chỉnh margin-left khi sidebar đóng
      >
        <Outlet />
      </div>

      {/* Hamburger Button (Only on Small Screen) */}
      <button
        className="sm:hidden fixed top-24 left-4 z-30 p-2 text-white bg-blue-600 rounded-full"
        onClick={toggleSidebar}
      >
        {/* Biểu tượng hamburger */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Close Sidebar Button (Only on Large Screen) */}
      <button
        className="hidden sm:block fixed top-6 left-64 z-30 p-2 text-white bg-red-600 rounded-full"
        onClick={toggleSidebar}
      >
        {/* Nút đóng sidebar */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default ManagementTicketPage;
