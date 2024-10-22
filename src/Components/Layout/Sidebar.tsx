import React from 'react'
import { NavLink } from 'react-router-dom';

function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={`bg-gray-800 text-white p-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <NavLink to="create-event" className="hover:underline">Event</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="loginPage" className="hover:underline">Border</NavLink>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">Order</a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:underline">Setting Organization</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;