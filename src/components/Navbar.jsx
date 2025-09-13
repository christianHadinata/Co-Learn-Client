import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

import userIcon from "../assets/icon.jpg";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          to="/"
          className="navbar-logo text-3xl font-bold text-[#4B5563] my-auto"
        >
          Co-Learn
        </Link>
      </div>

      <div className="navbar-center"></div>

      <div className="navbar-right">
        <Link to="/create" className="navbar-create-btn">
          + Create Learning Space
        </Link>

        <Link to="/profile" className="navbar-user-icon">
          <img src={userIcon} alt="User" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
