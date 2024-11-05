import SidebarDashBoard from '../components/SidebarDashBoard';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetOrganizationQuery } from '../../../../Apis/organizationApi';
import { RootState } from '../../../../Storage/Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setOrganization } from 'Storage/Redux/organizationSlice';

function OrganizationDashBoard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const idUser = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, error, isFetching } = useGetOrganizationQuery(idUser);

  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      navigate("/create-organization");
    }
    else {
      const tempData = {
        nameOrganization: data?.result?.nameOrganization,
        description: data?.result?.description,
        city: data?.result?.city,
        country: data?.result?.country,
      };
      dispatch(setOrganization({ idUser: idUser, idOrganization: data?.result?.idOrganization, ...tempData }));
      navigate("event");
    }
  }, [error, data]);

  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-1 h-full">
      <SidebarDashBoard className='col-span-1' />
      <div className='col-span-1 overflow-y-auto h-full'>
        <Outlet />
      </div>
    </div>
  );
}

export default OrganizationDashBoard;