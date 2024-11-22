import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { Header, Footer } from "../Components/Layout";
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { userModel } from '../Interfaces';
import { ForgetPassword, Login, Register, ResetPassword } from 'page/Auth';
import { HomePage } from 'page/Participant/Home';
import { PanelPage } from 'page/EventOrganization/OrganizationPanel';
import { CreateOrganizationPage, SettingOrganizationPage, OrganizationInfo, TeamManagement, ManageMemberPage, MemberList, RoleList } from 'page/EventOrganization/Organization';
import { EventsOverviewPage, EventUpsertPage, ManagementEventPage, EventDateForm, EventForm } from 'page/EventOrganization/Event';
import { TicketsOverviewPage } from 'page/EventOrganization/Ticket';
import { EventDetailPage } from 'page/Participant/EventDetail';
import { CheckoutPage, OrderSuccessPage } from 'page/Participant/Checkout';
import ManagementTicketPage from 'page/Participant/ManagementTicket/page/ManagementTicketPage';
import { LikeEvent, ListOrder, ManagementDetailOrder } from 'page/Participant/ManagementTicket';

function App() {
  const dispatch = useDispatch();

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path='/forgot-password' element={<ForgetPassword />} />
          <Route path="/e/:idEvent" element={<EventDetailPage />} />
          <Route path="/organization/create" element={<CreateOrganizationPage />} />
          <Route path="/dashboard" element={<PanelPage />} >
            <Route path="event" element={<ManagementEventPage />} >
              <Route index element={<EventsOverviewPage />} />
              <Route path="eventpage" element={<EventsOverviewPage />} />
            </Route>
            <Route path="create" element={<EventUpsertPage />} >
              <Route path="edit" element={<EventForm />} />
              <Route path="eventdate" element={<EventDateForm />} />
              <Route path="ticket" element={<TicketsOverviewPage />} />
            </Route>
            <Route path="update/:idEvent" element={<EventUpsertPage />} >
              <Route path="edit" element={<EventForm />} />
              <Route path="eventdate" element={<EventDateForm />} />
              <Route path="ticket" element={<TicketsOverviewPage />} />
            </Route>
            <Route path="organization" element={<SettingOrganizationPage />} >
              <Route index element={<OrganizationInfo />} />
              <Route path="info" element={<OrganizationInfo />} />
              <Route path="permissions" element={<ManageMemberPage />} >
                <Route path="user" element={<MemberList />} />
                <Route path="admin" element={<RoleList />} />
              </Route>
            </Route>
          </Route >
          {/*User*/}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/ticket" element={<ManagementTicketPage />} >
            <Route path="orders" element={<ListOrder />} />
            <Route path="like-event" element={<LikeEvent />} />
          </Route>
          <Route path="/detail-order/:idOrder" element={<ManagementDetailOrder />} />
        </Routes>
      </main>
    </div >
  );
}

export default App;