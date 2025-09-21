import React from "react";
import { Link } from "react-router-dom";

export default function Card({ id, thumbnail, title, members, lastUpdate }) {
  return (
    <Link to={`/space/${id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col hover:scale-105 cursor-pointer">
        <div className="h-40 w-full mb-4 overflow-hidden rounded-lg bg-white">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{members} Members</p>
        <p className="text-xs text-gray-500 mt-auto">
          Last update: {lastUpdate}
        </p>
      </div>
    </Link>
  );
}
