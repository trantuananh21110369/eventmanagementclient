import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { userModel } from '../../Interfaces';
import { RootState } from "../../Storage/Redux/store";
import { emptyUserState, setLoggedInUser } from '../../Storage/Redux/userAuthSlice';
import ModeTheme from "./ModeTheme";
import SearchStringBar from './SearchStringBar'; // Import component tìm kiếm
let logo = require('../../Assets/images/logo.jpg');

function Header({ className }: { className?: string }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("organization");
    dispatch(setLoggedInUser({ ...emptyUserState }));
    window.location.reload();
  };

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  document.documentElement.className = 'light';

  return (
    <header className={`bg-primary p-3 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between sm:ml-0">
        {/* Logo và tên ứng dụng */}
        <div className="flex items-center w-10 sm:w-auto sm:flex hidden sm:block">
          <Link to="/" className='flex flex-row gap-3 items-center'>
            <div className='h-10 w-10'>
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg" />
            </div>
            {/* Chỉ ẩn tên ứng dụng trên màn hình nhỏ */}
            <div className="text-second text-xl font-bold text-heading">
              Event
            </div>
          </Link>
        </div>
        {/* Thanh tìm kiếm đầu tiên (hiển thị trên màn hình lớn) */}
        <div className="hidden sm:block sm:w-auto sm:ml-4 flex-grow">
          <SearchStringBar />
        </div>
        {/* Điều chỉnh bố cục cho logo, mode theme, và avatar trên điện thoại */}
        <nav className="flex items-center sm:ml-auto w-full sm:w-auto justify-between mt-2 sm:mt-0">
          <div className="flex items-center w-full justify-between sm:flex sm:space-x-4 space-x-2">
            <div className="hidden sm:flex items-center space-x-4 relative">
              {userData.id ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="bg-primary flex items-center space-x-1 focus:outline-none hover:bg-secondaryColor">
                    <img
                      src={userData.urlImage}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border-2 border-secondaryColor"
                    />
                    <span className="text-second font-medium hidden sm:block">{userData.fullName}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 focus:outline-none z-50">
                    <div className='py-1 px-2 align-content: center'>
                      <Menu.Item>
                        <NavLink
                          to="/dashboard"
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Management Event
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink
                          to="/ticket"
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          My Ticket Order
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink
                          to="/your-profile"
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Your Profile
                        </NavLink>
                      </Menu.Item>

                      <Menu.Item>
                        <button
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200 mb-4"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <ModeTheme />
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              ) : (
                <div className='flex space-x-2'>
                  <NavLink className="nav-link text-second hover:text-primary" to="/register">
                    Register
                  </NavLink>
                  <NavLink className="btn-success nav-link text-second hover:text-primary" to="/login">
                    Login
                  </NavLink>
                </div>
              )}
            </div>
            {/* Hiển thị trên màn hình nhỏ */}
            <div className="flex sm:hidden items-center">
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg mr-52" />
              {userData.id ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="bg-primary flex items-center space-x-1 focus:outline-none hover:bg-secondaryColor">
                    <img
                      src={userData.urlImage}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border-2 border-secondaryColor"
                    />
                    <span className="text-second font-medium hidden sm:block">{userData.fullName}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 focus:outline-none z-50">
                    <div className='py-1 px-2 align-content: center'>
                      <Menu.Item>
                        <NavLink
                          to="/dashboard"
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Management Event
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink
                          to="/ticket"
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          My Ticket Order
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink
                          to="/your-profile"
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Your Profile
                        </NavLink>
                      </Menu.Item>

                      <Menu.Item>
                        <button
                          className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200 mb-4"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <ModeTheme />
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              ) : (
                <div className='flex space-x-2 bg-yellow-300 rounded-lg p-2'>
                  <NavLink className="nav-link text-second hover:text-primary" to="/register">
                    Register
                  </NavLink>
                  <NavLink className="btn-success nav-link text-second hover:text-primary" to="/login">
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </nav>
        {/* Thanh tìm kiếm thứ hai (hiển thị trên màn hình nhỏ) */}
        <div className="sm:hidden w-full mt-2">
          <SearchStringBar />
        </div>
      </div>
    </header>

  );

}

export default Header;
