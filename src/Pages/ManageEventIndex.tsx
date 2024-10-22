import React from 'react';
import { Sidebar } from '../Components/Layout';
import { Route, Routes, Outlet } from 'react-router-dom';
import CreateEvent from './event';
import { Switch } from '@headlessui/react';
import Login from './login';

function ManageEventIndex() {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] grid-cols-[auto,1fr] min-h-screen">
      <Sidebar className='col-span-1 sticky top-14 left-0 h-screen' />
      <div className='col-span-1 overflow-auto '>
        <h1>Manage Event Index</h1>
        <div className='h-[10000px]'>
          Xin chào
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ManageEventIndex;