import { Sidebar } from '../Components/Layout';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetOrganizationQuery } from '../Apis/organizationApi';
import { RootState } from '../Storage/Redux/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function ManagmentEvent() {
  const navigate = useNavigate();
  const idUser = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, error, isFetching } = useGetOrganizationQuery(idUser);

  console.log("Form Data", data);
  console.log("Form Error: ", error);

  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      navigate("/create-organization");
    }
  }, [error]);

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