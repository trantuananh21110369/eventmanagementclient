import SidebarDashBoard from '../components/SidebarOfPanel';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetOrganizationQuery } from '../../../../Apis/organizationApi';
import { RootState } from '../../../../Storage/Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setOrganization } from 'Storage/Redux/organizationSlice';
import { organizationModel } from 'Interfaces';
import { Loading } from 'Components/UI';

function PanelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const idUser = useSelector((state: RootState) => state.userAuthStore.id);
  const { data: dataOwner, error, isFetching } = useGetOrganizationQuery(idUser);
  const currentOraganization: organizationModel = useSelector((state: RootState) => state.organizationStore);

  //Kiem tra user có Organization hay chưa
  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      navigate("/organization/create");
    }
    else {
      const storedData = localStorage.getItem("organization");
      if (storedData) {
        const organizationData: organizationModel = JSON.parse(storedData) as organizationModel;
        dispatch(setOrganization({ idUser: organizationData.idUser, idOrganization: organizationData.idOrganization, nameOrganization: organizationData.nameOrganization, description: organizationData.description, city: organizationData.city, country: organizationData.country }));
        navigate("event");
      }
      else {
        const tempData = {
          nameOrganization: dataOwner?.result?.nameOrganization,
          description: dataOwner?.result?.description,
          city: dataOwner?.result?.city,
          country: dataOwner?.result?.country,
        };
        dispatch(setOrganization({ idUser: idUser, idOrganization: dataOwner?.result?.idOrganization, ...tempData })); navigate("event");
      }
    }
  }, [isFetching]);

  useEffect(() => { console.log(currentOraganization.nameOrganization) }, [currentOraganization])

  return (
    isFetching ? (
      <Loading />
    ) : (
      <div className="grid grid-cols-[auto_1fr] grid-rows-1 h-full">
        <SidebarDashBoard className="col-span-1" />
        <div className="col-span-1 overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    )
  );

}

export default PanelPage;