import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { Header, Footer, Sidebar } from "../Components/Layout";
import { Login, Home, Register, ManageEventIndex } from '../Pages';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { userModel } from '../Interfaces';
import CreateEvent from '../Pages/event';
import OrganizationSettings from '../Pages/event/organizationSetting';
import ManageEventPage from '../Pages/event/manageEventPage';

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
          <Route path="/manage-event" element={<ManageEventIndex />} >
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="loginPage" element={<Login />} />

          </Route>
        </Routes>
      </main>
      {location.pathname !== '/manage-event' && <Footer className="col-span-2" />}
    </div >
  );
}

export default App;