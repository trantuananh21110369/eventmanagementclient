import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarUpsertEventProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  className?: string; // Thêm className vào props
}

function SidebarUpsertEvent({ isSidebarOpen, toggleSidebar, className }: SidebarUpsertEventProps) {
  const location = useLocation();

  const isCreatePage = location.pathname === '/dashboard/create/edit';

  return (
    <div className={`h-screen bg-gray-900 transition-all duration-300 ${isSidebarOpen ? 'w-[300px]' : 'w-0'}`}>
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="text-gray-100 text-xl p-2">
          {/* Header with logo and close button */}
          <div className="p-2.5 flex items-center">
            <h1 className="font-bold pl-0.5 text-gray-200 text-[15px] ml-3">Event Management</h1>
            <i
              className="bi bi-x cursor-pointer ml-28 lg:hidden text-red-500"
              onClick={toggleSidebar}
            ></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>

          {/* Sidebar Navigation */}
          <nav>
            <ul>
              <li className="p-2.5 mt-3 flex items-center rounded-md cursor-pointer hover:bg-blue-600">
                <NavLink to="edit" className="w-full text-gray-200 font-bold text-[15px] ml-4 block">
                  Build Event
                </NavLink>
              </li>
              <li className={`p-2.5 mt-3 flex items-center rounded-md cursor-pointer hover:bg-blue-600 ${isCreatePage ? 'opacity-50 pointer-events-none' : ''}`}>
                <NavLink to="eventdate" className="w-full text-gray-200 font-bold text-[15px] ml-4 block">
                  Event Date
                </NavLink>
              </li>
              {/* <li className={`p-2.5 mt-3 flex items-center rounded-md cursor-pointer hover:bg-blue-600 ${isCreatePage ? 'opacity-50 pointer-events-none' : ''}`}>
                <NavLink to="agenda" className="w-full text-gray-200 font-bold text-[15px] ml-4 block">
                  Agenda
                </NavLink>
              </li> */}
              <li className={`p-2.5 mt-3 flex items-center rounded-md cursor-pointer hover:bg-blue-600 ${isCreatePage ? 'opacity-50 pointer-events-none' : ''}`}>
                <NavLink to="ticket" className="w-full text-gray-200 font-bold text-[15px] ml-4 block">
                  Ticket
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default SidebarUpsertEvent;
