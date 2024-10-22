import React from 'react';
import { Sidebar } from '../Components/Layout';
import { Outlet } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import Login from './Login';

function ManagmentEvent() {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] grid-cols-[auto,1fr] min-h-screen">
      <Sidebar className='col-span-1 sticky top-14 left-0 h-screen' />
      <div className='col-span-1 overflow-auto '>
        <div className='h-[10000px]'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ManagmentEvent;