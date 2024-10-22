import React from 'react';
import { Header, Footer } from "../Components/Layout";
import Login from '../Pages';
import CreateEvent from '../Pages/event';
import OrganizationSettings from '../Pages/event/organizationSetting';
import ManageEventPage from '../Pages/event/manageEventPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 p-4 overflow-auto">
          <CreateEvent/>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
