import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function ManagementEvent() {
  return (
    <div className="p-6 z-1">
      <header className="mb-6">
        <h1 className="text-4xl font-bold">Events</h1>
        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
          <p>
            We’ll be performing routine site maintenance starting at 12:15 AM PDT on Monday October 21. We expect this to take 15 minutes, and eventbrite.com will be unavailable during that time. For the latest status updates, refer to <a href="http://www.eventbritestatus.com" className="text-blue-600 underline">http://www.eventbritestatus.com</a>.
          </p>
        </div>
      </header>
      <nav className="mb-6">
        <ul className="flex space-x-4">
          <NavLink to="eventpage" className="active font-semibold border-b-2 border-blue-600">Events</NavLink>
          <li>Collections</li>
        </ul>
      </nav>
      <Outlet />
    </div >
  );
};

export default ManagementEvent;
