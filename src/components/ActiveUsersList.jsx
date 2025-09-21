import React from "react";
import { Link } from "react-router-dom";

export default function ActiveUsersList({ users }) {
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {users.map((u, i) => (
          <Link
            to={`/profile/${u}`}
            key={i}
            className="flex flex-col items-center text-sm hover:underline"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            {u}
          </Link>
        ))}
      </div>
    </div>
  );
}
