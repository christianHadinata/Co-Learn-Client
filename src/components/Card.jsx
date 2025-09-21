import React from "react";
import { Link } from "react-router-dom";

export default function Card({ id, thumbnail, title, members, lastUpdate }) {
  return (
    <Link to={`/space/${id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 flex flex-col hover:scale-105 cursor-pointer">
        <div className="h-full w-full mb-4 overflow-hidden rounded-lg bg-white">
          {thumbnail ? (
            <img
              src={
                thumbnail
                  ? `http://localhost:5000/${thumbnail}`
                  : "https://placehold.co/600x400/333333/FFFFFF.png"
              }
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-2xl font-semibold mb-1 py-5">{title}</h3>
        <p className="text-xl text-gray-600 py-2">{members} Members</p>
        <p className="text-base text-gray-500 mt-auto">
          Last update: {lastUpdate}
        </p>
      </div>
    </Link>
  );
}
