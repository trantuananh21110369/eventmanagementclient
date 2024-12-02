import React, { useEffect } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';

// Main Component with Tab Navigation
const SettingOrganizationPage = () => {
  useEffect(() => {
    // This ensures the default route is loaded when the component mounts
    window.history.replaceState(null, '', '/settings/info');
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Organization Settings</h1>

      {/* Fixed Dropdown on desktop */}
      <div className="fixed right-6 top-20 z-40 hidden lg:block">
        <Dropdown />
      </div>

      {/* Navigation Tabs with horizontal scroll */}
      <nav className="mb-6">
        <div className="overflow-x-auto">
          <ul className="flex flex-nowrap space-x-4 sm:space-x-6 text-lg font-medium text-gray-600">
            <li className="min-w-max">
              <NavLink
                to="info"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600'
                }
              >
                Organizer Profile
              </NavLink>
            </li>
            <li className="min-w-max">
              <NavLink
                to="permissions"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600'
                }
              >
                Team Management
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Content Area */}
      <Outlet />
    </div>
  );
};

export default SettingOrganizationPage;
