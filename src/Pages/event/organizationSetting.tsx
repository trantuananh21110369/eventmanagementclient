import React, { useState } from 'react';

// Organizer Profile Component
const OrganizerProfile = ({
  organizerName,
  organizationName,
  logo,
  country,
  handleOrganizerNameChange,
  handleOrganizationNameChange,
  handleLogoUpload,
  handleCountryChange,
  handleSave,
}: any) => {
  return (
    <div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Organizer profiles</h2>
        <p className="text-gray-600 mb-4">
          Each profile describes a unique organizer and shows all of their events on one page.
        </p>
        <div className="flex items-center space-x-4 bg-white p-4 rounded-md shadow-md">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={organizerName}
            onChange={handleOrganizerNameChange}
            placeholder="Unnamed organizer"
          />
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md" onClick={handleSave}>
            Edit
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Organization</h2>
        <p className="text-gray-600 mb-6">Details that apply across your events and venues.</p>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Organization Logo</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={handleLogoUpload}
          />
          {logo && <p className="mt-2 text-gray-600">{logo.name}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Organization Name</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={organizationName}
            onChange={handleOrganizationNameChange}
            maxLength={50}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Preferred Country</label>
          <select
            className="border border-gray-300 p-2 rounded-md w-full"
            value={country}
            onChange={handleCountryChange}
          >
            <option value="">Select a country</option>
            <option value="Vietnam">Vietnam</option>
            <option value="USA">USA</option>
          </select>
        </div>

        <button className="bg-indigo-600 text-white px-6 py-2 rounded-md" onClick={handleSave}>
          Save
        </button>
      </section>
    </div>
  );
};

// Team Management Component
const TeamManagement = () => {
  return (
    <div>
      <section className="bg-white p-6 rounded-md shadow-md">
        <div className="flex space-x-6 mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Users</button>
          <button className="border border-gray-300 px-4 py-2 rounded-md">Roles</button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <img src="https://via.placeholder.com/100" alt="Team Icon" className="mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Build your team</h2>
          <p className="text-gray-600 text-center mb-4">
            Create new custom roles and assign them to team members, or invite users into an all access role.
          </p>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-md">Invite users</button>
        </div>
      </section>
    </div>
  );
};

// Main Component with Tab Navigation
const OrganizationSettings = () => {
  const [activeTab, setActiveTab] = useState('OrganizerProfile');
  const [organizerName, setOrganizerName] = useState('Unnamed organizer');
  const [organizationName, setOrganizationName] = useState('Phát Tấn');
  const [country, setCountry] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };

  const handleOrganizerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizerName(event.target.value);
  };

  const handleOrganizationNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationName(event.target.value);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
  };

  const handleSave = () => {
    console.log({ organizerName, organizationName, country, logo });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Organization Settings</h1>
      
      {/* Navigation Tabs */}
      <nav className="mb-6">
        <ul className="flex space-x-6 text-lg font-medium text-gray-600">
          <li
            className={`cursor-pointer ${activeTab === 'OrganizerProfile' ? 'border-b-2 border-indigo-600' : ''}`}
            onClick={() => setActiveTab('OrganizerProfile')}
          >
            Organizer Profile
          </li>
          <li
            className={`cursor-pointer ${activeTab === 'TeamManagement' ? 'border-b-2 border-indigo-600' : ''}`}
            onClick={() => setActiveTab('TeamManagement')}
          >
            Team Management
          </li>
        </ul>
      </nav>

      {/* Conditional Rendering of Tabs */}
      {activeTab === 'OrganizerProfile' && (
        <OrganizerProfile
          organizerName={organizerName}
          organizationName={organizationName}
          logo={logo}
          country={country}
          handleOrganizerNameChange={handleOrganizerNameChange}
          handleOrganizationNameChange={handleOrganizationNameChange}
          handleLogoUpload={handleLogoUpload}
          handleCountryChange={handleCountryChange}
          handleSave={handleSave}
        />
      )}

      {activeTab === 'TeamManagement' && <TeamManagement />}
    </div>
  );
};

export default OrganizationSettings;
