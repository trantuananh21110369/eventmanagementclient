import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function ManagementTicketPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <div className="mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img src="https://placehold.co/600x400" alt="Profile" className="object-cover w-full h-full" />
          </div>
          <p className="text-center mt-2 font-bold">Name User</p>
        </div>

        <nav className="space-y-2">
          <NavLink to="orders" className="block p-2 rounded hover:bg-gray-300">Management Order</NavLink>
          <NavLink to="like-event" className="block p-2 rounded hover:bg-gray-300">Event Like</NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 bg-white">
        <Outlet />
      </div>
    </div>
  );
}

export default ManagementTicketPage;
