import React from "react";

function Footer({ className }: { className?: string }) {
  return (
    <footer className={`bg-primary p-4 text-second ${className}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Event Management</h2>
          <p className="text-sm">© 2023 Event Management. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-heading">About Us</a>
          <a href="#" className="hover:text-heading">Contact</a>
          <a href="#" className="hover:text-heading">Privacy Policy</a>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-heading">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-heading">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-heading">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;