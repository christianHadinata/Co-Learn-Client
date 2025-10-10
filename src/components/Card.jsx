import React from "react";
import { Link } from "react-router-dom";

export default function Card({ id, thumbnail, title, members, lastUpdate }) {
  return (
    <Link to={`/space/${id}`}>
      <div className="bg-white/0 backdrop-blur-md hover:border-white rounded-2xl shadow-md hover:shadow-xl transition p-0 flex flex-col hover:scale-105 cursor-pointer overflow-hidden">
        {/* IMAGE SECTION */}
        <div className="h-60 w-full overflow-hidden">
          {thumbnail ? (
            <img
              src={`http://localhost:5000/${thumbnail}`}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* text secction*/}
        <div className="bg-white/60 backdrop-blur-sm text-gray-900 px-6 py-4 rounded-b-none shadow-inner">
          <h3 className="text-2xl font-semibold mb-1">{title}</h3>
          <p className="text-lg opacity-80">{members} Members</p>
          <p className="text-sm opacity-60 mt-1">Last update: {lastUpdate}</p>
        </div>
      </div>
    </Link>
  );
}
