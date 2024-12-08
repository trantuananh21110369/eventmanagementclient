import React from 'react';
import { NavLink } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business'; // Organizations icon
import PeopleIcon from '@mui/icons-material/People'; // Users icon
import ReportIcon from '@mui/icons-material/Report'; // Report icon

function SidebarAdmin({ className }: { className?: string }) {
  return (
    <aside className={`bg-gray-800 text-white p-4 pt-10 ${className}`}>
      <nav>
        <ul className="space-y-8">
          <li className="flex justify-center">
            <NavLink
              to="organizations"
              className={({ isActive }) =>
                `flex justify-center items-center text-4xl border-2 ${isActive
                  ? "border-white focus:ring-4 focus:ring-blue-500"
                  : "border-transparent hover:border-gray-400"
                } p-2 rounded transition duration-300`
              }
              title="organizations"
            >
              <BusinessIcon />
            </NavLink>
          </li>
          <li className="flex justify-center">
            <NavLink
              to="users"
              className={({ isActive }) =>
                `flex justify-center items-center text-4xl border-2 ${isActive
                  ? "border-white focus:ring-4 focus:ring-blue-500"
                  : "border-transparent hover:border-gray-400"
                } p-2 rounded transition duration-300`
              }
              title="users"
            >
              <PeopleIcon />
            </NavLink>
          </li>
          <li className="flex justify-center">
            <NavLink
              to="report"
              className={({ isActive }) =>
                `flex justify-center items-center text-4xl border-2 ${isActive
                  ? "border-white focus:ring-4 focus:ring-blue-500"
                  : "border-transparent hover:border-gray-400"
                } p-2 rounded transition duration-300`
              }
              title="report"
            >
              <ReportIcon />
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarAdmin;
