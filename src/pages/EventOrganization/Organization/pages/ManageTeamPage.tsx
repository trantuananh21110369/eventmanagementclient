import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ManageTeamPage = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-1/5 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-gray-700">Manage Members</h1>
        </div>
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <NavLink
                to="user"
                className={({ isActive }) =>
                  isActive
                    ? 'block px-4 py-2 bg-blue-500 text-white rounded'
                    : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'
                }
              >
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="admin"
                className={({ isActive }) =>
                  isActive
                    ? 'block px-4 py-2 bg-blue-500 text-white rounded'
                    : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'
                }
              >
                Roles
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-4/5 p-6 overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageTeamPage;
