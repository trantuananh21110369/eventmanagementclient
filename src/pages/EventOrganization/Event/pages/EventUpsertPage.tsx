import { Outlet } from 'react-router-dom'
import SidebarUpsertEvent from '../components/SidebarUpsertEvent'

function EventUpsertPage() {
  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-auto h-full">
      <SidebarUpsertEvent className="h-full" />
      <div className="overflow-y-auto p-10">
        <Outlet />
      </div>
    </div>
  )
}

export default EventUpsertPage
