import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

import userIcon from "../assets/icon.jpg";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Co-Learn</Link>
      </div>

      <div className="navbar-center"></div>

      <div className="navbar-right">
        <Link to="/create" className="create-btn">
          + Create Learning Space
        </Link>

        <Link to="/profile" className="user-icon">
          <img src={userIcon} alt="User" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
