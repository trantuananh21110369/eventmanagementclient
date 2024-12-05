import React from 'react';
import { NavLink } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event'; // Event icon
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Order icon
import DashboardIcon from '@mui/icons-material/Dashboard'; // Dashboard icon
import SettingsIcon from '@mui/icons-material/Settings'; // Settings icon
import ChatIcon from '@mui/icons-material/Chat'; // Chat icon

function SidebarDashBoard({ className }: { className?: string }) {
  return (
    <aside className={`bg-gray-800 text-white p-4 pt-10 ${className}`}>
      <nav>
        <ul className="space-y-8">
          <li className="flex justify-center">
            <NavLink
              to="event"
              className={({ isActive }) =>
                `flex justify-center items-center text-4xl border-2 ${isActive
                  ? "border-white focus:ring-4 focus:ring-blue-500"
                  : "border-transparent hover:border-gray-400"
                } p-2 rounded transition duration-300`
              }
              title="Event" // Tag tên
            >
              <EventIcon />
            </NavLink>
          </li>
          <li className="flex justify-center">
            <NavLink
              to="order"
              className={({ isActive }) =>
                `flex justify-center items-center text-4xl border-2 ${isActive
                  ? "border-white focus:ring-4 focus:ring-blue-500"
                  : "border-transparent hover:border-gray-400"
                } p-2 rounded transition duration-300`
              }
              title="Order" // Tag tên
            >
              <ShoppingCartIcon />
            </NavLink>
          </li>
          <li className="flex justify-center">
            <NavLink
              to="chatOrganization"
              className={({ isActive }) =>
                `flex justify-center items-center text-4xl border-2 ${isActive
                  ? "border-white focus:ring-4 focus:ring-blue-500"
                  : "border-transparent hover:border-gray-400"
                } p-2 rounded transition duration-300`
              }
              title="Chat" // Tag tên
            >
              <ChatIcon />
            </NavLink>
          </li>
          <li className="flex justify-center">
            <NavLink
              to="organization"
              className={({ isActive }) =>
                `flex justify-center items-center text-4xl border-2 ${isActive
                  ? "border-white focus:ring-4 focus:ring-blue-500"
                  : "border-transparent hover:border-gray-400"
                } p-2 rounded transition duration-300`
              }
              title="Organization" // Tag tên
            >
              <SettingsIcon />
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarDashBoard;
