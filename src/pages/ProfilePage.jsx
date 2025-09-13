import { useState } from "react";
import userIcon from "../assets/icon.jpg"; 

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Lorem ipsum Lorem ipsum",
    biography: "Lorem ipsum lorem ipsum",
    country: "Lorem ipsum Lorem ipsum",
    interests: ["coding", "reading", "gaming"],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestsChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      interests: e.target.value.split(",").map((i) => i.trim()),
    }));
  };

  return (
    <div className="gradient-bg relative min-h-screen flex justify-center items-center">
      <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-xl p-8 w-96 relative z-10">
        <div className="flex justify-center mb-6">
          <img
            src={userIcon}
            alt="User"
            className="w-20 h-20 rounded-full border-2 border-gray-200"
          />
        </div>

        {!isEditing ? (
          <>
            <p className="mb-3 text-gray-800">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="mb-3 text-gray-800">
              <strong>Biography:</strong> {profile.biography}
            </p>
            <p className="mb-3 text-gray-800">
              <strong>Country:</strong> {profile.country}
            </p>
            <p className="mb-4 text-gray-800">
              <strong>Interests:</strong>{" "}
              {profile.interests.map((i, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                >
                  {i}
                </span>
              ))}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full text-white bg-[#574ff2] hover:bg-[#3731ab] font-medium rounded-lg text-sm px-5 py-2.5 mb-4 transition-colors"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              Name:
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none"
                placeholder="Your name"
              />
            </label>

            <label className="block mb-3 text-sm font-medium text-gray-700">
              Biography:
              <input
                type="text"
                name="biography"
                value={profile.biography}
                onChange={handleChange}
                className="mt-1 block w-full p-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none"
                placeholder="Short bio"
              />
            </label>

            <label className="block mb-3 text-sm font-medium text-gray-700">
              Country:
              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
                className="mt-1 block w-full p-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none"
                placeholder="Country"
              />
            </label>

            <label className="block mb-4 text-sm font-medium text-gray-700">
              Interests:
              <input
                type="text"
                value={profile.interests.join(", ")}
                onChange={handleInterestsChange}
                className="mt-1 block w-full p-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none"
              />
            </label>

            <button
              onClick={() => setIsEditing(false)}
              className="w-full text-white bg-[#574ff2] hover:bg-[#3731ab] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
