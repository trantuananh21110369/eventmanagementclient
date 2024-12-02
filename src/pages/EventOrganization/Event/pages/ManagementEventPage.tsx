import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function ManagementEventPage() {
  return (
    <div className="p-6 z-1">
      <header className="mb-6">
        <h1 className="text-4xl font-bold">Events</h1>
      </header>
      <nav className="mb-6">
        <ul className="flex space-x-4">
          <NavLink to="eventpage" className="active font-semibold border-b-2 border-blue-600">Events</NavLink>
          <li></li>
        </ul>
      </nav>
      <Outlet />
    </div >
  );
};

export default ManagementEventPage;
