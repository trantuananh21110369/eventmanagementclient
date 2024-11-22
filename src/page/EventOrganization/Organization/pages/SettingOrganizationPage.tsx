import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Dropdown from '../components/Dropdown';

// Main Component with Tab Navigation
const SettingOrganizationPage = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Organization Settings</h1>
      <div className="fixed right-10 top-20 z-50">
        <Dropdown />
      </div>
      {/* Navigation Tabs */}
      <nav className="mb-6">
        <ul className="flex space-x-6 text-lg font-medium text-gray-600">
          <li>
            <NavLink
              to="info"
              className="border-b-2"
            >
              Organizer Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="permissions"
              className="border-b-2"
            >
              Team Management
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default SettingOrganizationPage;
