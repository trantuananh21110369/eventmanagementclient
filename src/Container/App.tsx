import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { Header, Footer, Sidebar } from "../Components/Layout";
import { Login, Home, Register, ManagmentEvent } from '../Pages';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { userModel } from '../Interfaces';
import { CreateEvent, ManageEventPage } from '../Pages/ManageEvent/Event';
import { OrganizationSettings, CreateOrganization } from '../Pages/ManageEvent/Organization';
import OrganizationInfo from '../Pages/ManageEvent/Organization/OrganizationInfo';
import TeamManagement from '../Pages/ManageEvent/Organization/TeamManagement';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    console.log("App Use Effect");
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, []);

  return (
    <div className="grid grid-rows-[auto,1fr,auto] grid-cols-[auto,1fr] min-h-screen">
      <Header className="col-span-2" />
      <main className=" col-span-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="create-organization" element={<CreateOrganization />} />
          <Route path="/manage-event" element={<ManagmentEvent />} >
            <Route path="event" element={<ManageEventPage />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="organization" element={<OrganizationSettings />} >
              <Route path="info" element={<OrganizationInfo />} />
              <Route path="permissions" element={<TeamManagement />} />
            </Route>
          </Route >
        </Routes>
      </main>
      {location.pathname !== '/manage-event' && <Footer className="col-span-2" />}
    </div >
  );
}

export default App;