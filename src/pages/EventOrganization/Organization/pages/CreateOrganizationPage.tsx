import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrganizationMutation } from '../../../../Apis/organizationApi';
import { organizationModel, apiResponse } from '../../../../Interfaces';
import { inputHepler, toastNotify } from '../../../../Helper';
import { RootState } from '../../../../Storage/Redux/store';

const CreateOrganizationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrganization] = useCreateOrganizationMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [organizationInput, setOrganizationInput] = useState({
    nameOrganization: "",
    description: "",
    city: "",
    Country: "",
  });
  const userId = useSelector((state: RootState) => state.userAuthStore.id);

  const handleInputOrganization = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const tempData = inputHepler(e, organizationInput);
    setOrganizationInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await createOrganization({
      IdUserOwner: userId,
      NameOrganization: organizationInput.nameOrganization,
      Description: organizationInput.description,
      City: organizationInput.city,
      Country: organizationInput.Country,
    });

    if (response.data) {
      toastNotify("Organization Created Successfully");
      navigate("/manage-event");
    } else {
      setError(response.error?.data?.errorMessages?.[0]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Organization</h2>
        <form method="post" onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full px-2">
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="nameOrganization">
              Organization Name
            </label>
            <input
              type="text"
              placeholder="Enter Organization Name"
              name="nameOrganization"
              value={organizationInput.nameOrganization}
              onChange={handleInputOrganization}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              placeholder="Enter Description"
              name="description"
              value={organizationInput.description}
              onChange={handleInputOrganization}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="city">
              City
            </label>
            <input
              type="text"
              placeholder="Enter City"
              name="city"
              value={organizationInput.city}
              onChange={handleInputOrganization}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="Country">
              Country
            </label>
            <select
              name="Country"
              value={organizationInput.Country}
              onChange={handleInputOrganization}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            >
              <option value="">Select a country</option>
              <option value="Vietnam">Vietnam</option>
              <option value="USA">USA</option>
            </select>
          </div>
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Organization
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationPage;