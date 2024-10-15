import React from 'react';
import ModeTheme from "./ModeTheme";
let logo = require("../../Asset/logo.jpg");

function Header() {
  return (
    <header className="bg-primary p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg" />
          <div className="text-second text-xl font-bold text-heading">Event</div>
        </div>
        <nav className="flex space-x-4 items-center">
          <ModeTheme />
          <a href="#" className="text-second hover:text-heading">Login</a>
          <a href="#" className="text-second hover:text-heading">Register</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;