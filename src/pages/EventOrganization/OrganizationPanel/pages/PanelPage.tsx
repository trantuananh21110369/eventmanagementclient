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

  useEffect(() => {
    //Kiem tra user có Organization hay chưa
    console.log(error);
    if (!isFetching) {
      if (error && 'status' in error && error?.status === 404) {
        navigate("/organization/create");
      }
      else {
        const storedData: any = localStorage.getItem("organization");
        if (storedData?.idOrganization) {
          const organizationData: organizationModel = JSON.parse(storedData) as organizationModel;
          dispatch(setOrganization({
            idUser: organizationData.idUser, idOrganization: organizationData.idOrganization, nameOrganization: organizationData.nameOrganization,
            description: organizationData.description, city: organizationData.city,
            country: organizationData.country, urlImage: organizationData.urlImage
          }));
          navigate("event");
        }
        else {
          const tempData = {
            idOrganization: dataOwner?.result?.idOrganization,
            nameOrganization: dataOwner?.result?.nameOrganization,
            description: dataOwner?.result?.description,
            city: dataOwner?.result?.city,
            country: dataOwner?.result?.country,
            urlImage: dataOwner?.result?.urlImage,
          };
          dispatch(setOrganization({ idUser: idUser, ...tempData })); navigate("event");
          localStorage.setItem("organization", JSON.stringify(tempData));
        }
      }
    }
  }, [dataOwner, error]);

  useEffect(() => { console.log(currentOraganization.nameOrganization) }, [currentOraganization])

  return (
    isFetching ? (
      <Loading />
    ) : (
      <div className="flex h-full">
        <SidebarDashBoard className="flex-shrink-1 w-[8%] min-w-[50px] max-w-[200px]" />
        <div className="flex-grow overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    )
  );
}

export default PanelPage;