import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

// import userIcon from "../assets/icon.jpg";

import { UserContext } from "../context/User";
import ProfileDropDown from "./ProfileDropDown";

function Navbar() {
  const { user } = useContext(UserContext);
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
        <Link to="/create-new-learning-space" className="navbar-create-btn">
          + Create Learning Space
        </Link>

        {user ? (
          <div className="">
            <ProfileDropDown />
          </div>
        ) : (
          <Link
            to={"/login"}
            className="text-white bg-[#574ff2] focus:outline-[#3731ab] active:bg-[#3731ab] hover:bg-[#3731ab] px-4 py-2 font-medium rounded-lg text-sm cursor-pointer"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
