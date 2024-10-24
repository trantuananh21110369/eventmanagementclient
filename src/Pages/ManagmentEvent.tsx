import { Sidebar } from '../Components/Layout';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetOrganizationQuery } from '../Apis/organizationApi';
import { RootState } from '../Storage/Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setOrganization } from '../Storage/Redux/organizationSlice';

function ManagmentEvent() {
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
      console.log(tempData)
      dispatch(setOrganization({ idUser: idUser, idOrganization: data?.result?.idOrganization, ...tempData }));
      navigate("event");
    }
  }, [error, data]);

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