import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { userModel } from '../Interfaces';
//Auth
import { ForgetPassword, Login, Register, ResetPassword, SettingProfile } from 'pages/Auth';
//User
import { Header, Footer, PopupClientMessage } from "../Components/Layout";
import { HomePage } from 'pages/Participant/Home';
import { PanelPage } from 'pages/EventOrganization/OrganizationPanel';
import { EventDetailPage } from 'pages/Participant/EventDetail';
import { LikeEvent, ListOrder, UserOrderDetailPage } from 'pages/Participant/ManagementTicket';
import { CheckoutPage, OrderSuccessPage } from 'pages/Participant/Checkout';
//Organization
import { OrdersOverviewPage, OrderDetailPage } from 'pages/EventOrganization/Order';
import { EventsOverviewPage, EventUpsertPage, ManagementEventPage, EventDateForm, EventForm } from 'pages/EventOrganization/Event';
import { CreateOrganizationPage, SettingOrganizationPage, OrganizationInfo, ManageMemberPage, MemberPage, RolePage } from 'pages/EventOrganization/Organization';
import ManagementTicketPage from 'pages/Participant/ManagementTicket/page/ManagementTicketPage';
import { TicketsOverviewPage } from 'pages/EventOrganization/Ticket';
import ChatPage from 'pages/EventOrganization/Chat';
import ChatPopup from 'Components/Layout/ChatPopup';

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
          {/*Auth*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path='/forgot-password' element={<ForgetPassword />} />
          <Route path='/your-profile' element={<SettingProfile />} />
          {/*Organization*/}
          <Route path="/organization/create" element={<CreateOrganizationPage />} />
          <Route path="/dashboard" element={<PanelPage />} >
            <Route index element={<ManagementEventPage />} />
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
            <Route path="chatOrganization" element={<ChatPage />} />
            <Route path="organization" element={<SettingOrganizationPage />} >
              <Route index element={<OrganizationInfo />} />
              <Route path="info" element={<OrganizationInfo />} />
              <Route path="permissions" element={<ManageMemberPage />} >
                <Route path="user" element={<MemberPage />} />
                <Route path="admin" element={<RolePage />} />
              </Route>
            </Route>
            <Route path="order-detail/:idOrderHeader" element={<OrderDetailPage />} />
            <Route path="order" element={<OrdersOverviewPage />} />
          </Route >
          {/*User*/}
          <Route path="/e/:idEvent" element={<EventDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/ticket" element={<ManagementTicketPage />} >
            <Route path="orders" element={<ListOrder />} />
            <Route path="like-event" element={<LikeEvent />} />
            <Route path="order-detail/:idOrderHeader" element={<UserOrderDetailPage />} />
          </Route>
        </Routes>
      </main>
      <PopupClientMessage />
    </div >
  );
}

export default App;