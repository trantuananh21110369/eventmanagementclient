import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setOrganization } from 'Storage/Redux/organizationSlice';
import { organizationModel } from 'Interfaces';
import { Loading } from 'Components/UI';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarAdmin from './component/SidebarAdmin';

function PanelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return ((
    <div className="flex h-full">
      <SidebarAdmin className="flex-shrink-1 w-[8%] min-w-[50px] max-w-[200px]" />
      <div className="flex-grow overflow-y-auto h-full">
        <Outlet />
      </div>
    </div>
  )
  );
}

export default PanelPage;