import React, { useContext } from "react";

import { UserContext } from "../context/User";
import { Link } from "react-router-dom";

export default function ProfileDropDown() {
  const { user, logoutUser } = useContext(UserContext);
  console.log(user);
  return (
    <div className="relative group">
      <div className="rounded-full p-2 hover:bg-gray-100 cursor-pointer">
        <img
          src={
            user.user_photo_url
              ? `http://localhost:5000/${user.user_photo_url}`
              : "../src/assets/default-profile.jpg"
          }
          width={35}
          height={35}
          alt="profile"
          className="rounded-full"
        />
      </div>

      <div className="absolute right-0 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200">
        <div className="mb-2 p-2">
          <p className="font-semibold text-lg">
            {user.user_name ? user.user_name : ""}
          </p>
          <p className="text-sm text-gray-600 pb-2">
            {user.user_email ? user.user_email : ""}
          </p>
        </div>
        <hr className="my-2" />
        <div className="flex flex-col gap-2">
          <div className="w-full p-2 hover:bg-slate-100 rounded-lg">
            <Link to="/profile" className="flex items-center gap-2 text-sm ">
              <img
                src="../src/assets/edit-profile.png"
                alt=""
                className="w-5 h-5"
              />
              Edit Profile
            </Link>
          </div>
          <div className="w-full p-2 hover:bg-slate-100 rounded-lg">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm "
              onClick={logoutUser}
            >
              <img src="../src/assets/logout.png" alt="" className="w-5 h-5" />
              Log out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
