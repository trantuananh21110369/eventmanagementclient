import React from 'react'
import { NavLink } from 'react-router-dom'

function SidebarUpsertEvent({ className }: { className?: string }) {

  return (
    <aside className={`bg-gray-500 text-white p-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Set up event</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <NavLink to="edit" className="hover:underline">Build event</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="eventdate" className="hover:underline">Event Date</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="agenda" className="hover:underline">Agenda</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="ticket" className="hover:underline">Ticket</NavLink>
          </li>
          Dropdown here
        </ul>
      </nav>
    </aside>
  )
}

export default SidebarUpsertEvent
