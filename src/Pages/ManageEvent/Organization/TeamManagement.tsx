import React from 'react';

function TeamManagement() {
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
}

export default TeamManagement;
