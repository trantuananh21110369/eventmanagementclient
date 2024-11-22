import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUpdateOrganizationMutation } from '../../../../Apis/organizationApi';
import { organizationModel, apiResponse } from '../../../../Interfaces';
import { setOrganization } from '../../../../Storage/Redux/organizationSlice';
import { inputHepler, toastNotify } from '../../../../Helper';
import { useGetOrganizationQuery } from '../../../../Apis/organizationApi';
import { RootState } from '../../../../Storage/Redux/store';
import { SD_Country } from '../../../../Utility/SD';

const Countries = [
  SD_Country.vietnam,
  SD_Country.usa,
]

function OrganizationInfo() {
  const dispatch = useDispatch();
  const [updateOrganization] = useUpdateOrganizationMutation();
  const idUser = useSelector((state: RootState) => state.userAuthStore.id);
  const [loading, setLoading] = useState(false);
  const [errorM, setError] = useState("");
  const [organizationInput, setOrganizationInput] = useState({
    nameOrganization: "",
    description: "",
    city: "",
    country: "",
  });

  // Fetching Organization
  const currentOrganization = useSelector((state: RootState) => state.organizationStore);

  //Get data to input
  useEffect(() => {
    if (currentOrganization.idOrganization) {
      const tempData = {
        nameOrganization: currentOrganization.nameOrganization,
        description: currentOrganization.description,
        city: currentOrganization.city,
        country: currentOrganization.country,
      }
      setOrganizationInput(tempData);
      dispatch(setOrganization({ idUser: idUser, idOrganization: currentOrganization.idOrganization, ...tempData }));
    }
  }, [currentOrganization]);

  const handleInputOrganization = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const tempData = inputHepler(e, organizationInput);
    setOrganizationInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await updateOrganization({ data: { idOrganization: currentOrganization.idOrganization, ...organizationInput }, idUser });

    if (response.data) {
      toastNotify("Organization Created Successfully");
    } else {
      setError(response.error?.data?.errorMessages?.[0]);
    }

    setLoading(false);
  };

  return (
    <div>
      {(
        <form method="post" onSubmit={handleSubmit}>
          <section className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Organization</h2>
            <p className="text-gray-600 mb-6">Details that apply across your events and venues.</p>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Name Organization</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
                maxLength={50}
                name="nameOrganization"
                value={organizationInput.nameOrganization}
                onChange={handleInputOrganization}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Description</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
                name="description"
                value={organizationInput.description}
                onChange={handleInputOrganization}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
                name="city"
                value={organizationInput.city}
                onChange={handleInputOrganization}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Preferred Country</label>
              <select
                className="border border-gray-300 p-2 rounded-md w-full"
                name="Country"
                value={organizationInput.country}
                onChange={handleInputOrganization}
              >
                {Countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {errorM && (<div className="mb-2 text-red-500">{errorM}</div>)}
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md" disabled={loading}>
              Save
            </button>
          </section>
        </form>
      )}
    </div>
  );
}

export default OrganizationInfo;