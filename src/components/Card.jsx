import React from "react";

export default function Card({ thumbnail, title, members, lastUpdate }) {
  return (
    <div className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col hover:scale-105 cursor-pointer">
      <div className="h-40 w-full mb-4 overflow-hidden rounded-lg bg-gray-300">
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
      <p className="text-xs text-gray-500 mt-auto">Last update: {lastUpdate}</p>
    </div>
  );
}
