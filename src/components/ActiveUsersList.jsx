import React from "react";
import { Link } from "react-router-dom";
import defaultProfileImage from "../assets/default-profile.jpg";

export default function ActiveUsersList({ users }) {
  return (
    <div>
      <div className="flex flex-wrap gap-8">
        {users.map((user) => (
          <Link
            to={`/view-profile/${user.user_id}`}
            key={user.user_id}
            className="flex flex-col items-center text-sm hover:underline max-w-12"
          >
            <img
              src={
                user.user_photo_url
                  ? `http://localhost:5000/${user.user_photo_url}`
                  : defaultProfileImage
              }
              alt=""
              className="w-12 h-12 rounded-full"
            />

            <div className="pt-2">{user.user_name}</div>
          </Link>
        ))}
        {/* {users.map((u, i) => {
          console.log(u);
          console.log(i);
        })} */}
      </div>
    </div>
  );
}
