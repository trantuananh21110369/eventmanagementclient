import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { Header, Footer } from "../Components/Layout";
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { userModel } from '../Interfaces';
import { Login, Register } from 'features/Auth';
import { HomePage } from 'features/Participant/Home';
import { OrganizationDashBoard } from 'features/EventOrganization/DashBoard';
import { CreateOrganization, OrganizationInfo, OrganizationSettings, TeamManagement } from 'features/EventOrganization/Organization';
import { EventDateForm, EventForm, ManagementEvent, ShowEvents, UpsertEvent } from 'features/EventOrganization/EventManagement';
import { ShowTickets, TicketForm } from 'features/EventOrganization/Ticket';
import AgendaForm from 'features/EventOrganization/EventManagement/components/AgendaForm';
import { EventDetail } from 'features/Participant/EventDetailOrder';


function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, []);

  return (
    <div className="grid grid-rows-[1fr_11fr] grid-cols-1 h-screen">
      <Header className="col-span-1 z-50 w-full h-auto" />
      <main className="col-span-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/e/:idEvent" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organization/create" element={<CreateOrganization />} />
          <Route path="/dashboard" element={<OrganizationDashBoard />} >
            <Route path="event" element={<ManagementEvent />} >
              <Route index element={<ShowEvents />} />
              <Route path="eventpage" element={<ShowEvents />} />
            </Route>
            <Route path="create" element={<UpsertEvent />} >
              <Route path="edit" element={<EventForm />} />
              <Route path="eventdate" element={<EventDateForm />} />
              <Route path="agenda" element={<AgendaForm />} />
              <Route path="ticket" element={<ShowTickets />} />
            </Route>
            <Route path="update/:idEvent" element={<UpsertEvent />} >
              <Route path="edit" element={<EventForm />} />
              <Route path="eventdate" element={<EventDateForm />} />
              <Route path="agenda" element={<AgendaForm />} />
              <Route path="ticket" element={<ShowTickets />} />
            </Route>
            <Route path="organization" element={<OrganizationSettings />} >
              <Route path="info" element={<OrganizationInfo />} />
              <Route path="permissions" element={<TeamManagement />} />
            </Route>
          </Route >
        </Routes>
      </main>
    </div >
  );
}

export default App;