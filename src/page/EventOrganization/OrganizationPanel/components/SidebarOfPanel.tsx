import React from 'react'
import { NavLink } from 'react-router-dom';

function SidebarDashBoard({ className }: { className?: string }) {
  return (
    <aside className={`bg-gray-800 text-white p-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Manage</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <NavLink to="event" className="hover:underline">Event</NavLink>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">Order</a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">Dash Broad</a>
          </li>
          <li className="mb-2">
            <NavLink to="organization" className="hover:underline">Setting Organization</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarDashBoard;