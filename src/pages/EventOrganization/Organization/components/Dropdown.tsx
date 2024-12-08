import { useGetOrganizationByUserIdQuery } from "Apis/organizationApi";
import { organizationModel, userModel } from "Interfaces";
import { setOrganization } from "Storage/Redux/organizationSlice";
import { RootState } from "Storage/Redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dropdown = () => {
  const user: userModel = useSelector((state: RootState) => state.userAuthStore);
  const dispatch = useDispatch();
  const currentOrganization: organizationModel = useSelector((state: RootState) => state.organizationStore);

  const { data, isFetching } = useGetOrganizationByUserIdQuery(user.id);
  const [dataJoinedEvent, setDataJoinedEvent] = useState<organizationModel[]>([]);

  useEffect(() => {
    if (data) {
      setDataJoinedEvent(data?.result);
    }
  }, [data]);


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const tempData = dataJoinedEvent.find((org: any) => org.idOrganization == selected);
    localStorage.setItem("organization", JSON.stringify(tempData));
    dispatch(setOrganization({
      idUser: tempData?.idUser, idOrganization: tempData?.idOrganization,
      nameOrganization: tempData?.nameOrganization, description: tempData?.description,
      city: tempData?.city, country: tempData?.country, urlImage: tempData?.urlImage
    }));
  }

  return (
    <form className="max-w-sm mx-auto">
      <label htmlFor="organizations" className="block mb-2 text-sm font-medium text-gray-900">Your Organization</label>
      <select
        onChange={handleSelectChange}
        id="organizations" className="bg-gray-50 border border-gray-300 text-second-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {!isFetching && dataJoinedEvent?.map((org: any, index: number) => (
          <option key={index} value={org.idOrganization} selected={currentOrganization.idOrganization == org.idOrganization}>{org.nameOrganization}</option>
        ))}
      </select>
    </form>
  );
};

export default Dropdown;
