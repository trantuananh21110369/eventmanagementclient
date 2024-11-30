import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Avatar } from '@mui/material';
import { userModel } from '../../Interfaces';
import { RootState } from "../../Storage/Redux/store";
import { emptyUserState, setLoggedInUser } from '../../Storage/Redux/userAuthSlice';
import ModeTheme from "./ModeTheme";
let logo = require('../../Assets/images/logo.jpg');

function Header({ className }: { className?: string }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("organization");
    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/");
  };

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  console.log(userData);
  return (
    <header className={`bg-primary p-3 ${className}`}>
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className='flex flex-row gap-3 items-center'>
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg" />
            <div className="text-second text-xl font-bold text-heading">Event</div>
          </Link>
        </div>
        <nav className="flex items-center">
          <div className='px-2'>
            <ModeTheme />
          </div>
          <div className="ml-auto">
            {userData.id ? (
              <Menu>
                <MenuButton className="bg-primary flex items-center space-x-1 focus:outline-none">
                  <img
                    src={userData.urlImage}
                    alt="Avatar"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%', // Để tạo viền bo tròn như avatar
                      border: '2px solid #secondaryColor' // Viền của ảnh
                    }}
                  />
                  <span className="text-second font-medium">{userData.fullName}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </MenuButton>
                <MenuItems className="absolute px-2 mt-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none -z-40">
                  <div className='py-1'>
                    <MenuItem>
                      <NavLink to="/dashboard" className="block w-full text-left py-2 text-sm text-gray-700">
                        Management Event
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/ticket" className="block w-full text-left py-2 text-sm text-gray-700">
                        My Ticket Order
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/your-profile" className="block w-full text-left py-2 text-sm text-gray-700">
                        Your Profile
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <button
                        className="block w-full text-left py-2 text-sm text-gray-700"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>

            ) : (
              <>
                <div className='flex space-x-2'>
                  <NavLink className="nav-link text-second" to="/register">
                    Register
                  </NavLink>
                  <NavLink
                    className="btn-success nav-link text-second"
                    to="/login"
                  >
                    Login
                  </NavLink>
                </div>
              </>
            )
            }
          </div >
        </nav >
      </div >
    </header >
  );
}

export default Header;