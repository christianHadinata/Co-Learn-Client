import { useContext, useEffect, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import userIcon from "../assets/icon.jpg";
import { AxiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { UserContext } from "../context/User";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const RemoveComponent = ({ onRemove, className }) => {
  return (
    <button onClick={onRemove} className={className}>
      x
    </button>
  );
};

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    biography: "",
    country: "",
    interests: [],
  });

  const [isEditing, setIsEditing] = useState(false);

  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await AxiosInstance.get(
        `http://localhost:5000/api/v1/users/`
      );

      const { user_name, user_biography, user_country, user_interests } =
        data.data;

      const profileData = {
        name: user_name,
        biography: user_biography,
        country: user_country,
        interests: user_interests.map((interest) => ({
          id: interest,
          text: interest,
        })),
      };

      console.log(data);
      console.log(profileData);
      setProfile(profileData);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (i) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((tag, index) => index !== i),
    }));
  };

  const handleAddition = (tag) => {
    setProfile((prev) => ({
      ...prev,
      interests: [...prev.interests, tag],
    }));
  };

  const handleSave = async () => {
    const savedProfile = {
      ...profile,
      interests: profile.interests.map((i) => i.text),
    };
    console.log(savedProfile);

    try {
      const { data } = await AxiosInstance.patch(
        `http://localhost:5000/api/v1/users/profile`,
        {
          user_name: savedProfile.name,
          user_biography: savedProfile.biography,
          user_country: savedProfile.country,
          user_interests: savedProfile.interests,
        }
      );

      console.log(data);

      if (data.success === true) {
        const updatedData = { user_name: savedProfile.name };
        updateUser(updatedData);
        toast.success("Success! Profile Updated");
      }
    } catch (error) {
      console.log(error);
    }
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
                  {i.text}
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
              <ReactTags
                tags={profile.interests}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                delimiters={delimiters}
                placeholder="Add interests..."
                inputFieldPosition="bottom"
                classNames={{
                  tag: "inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1 cursor-pointer",
                  remove:
                    "ml-2 text-red-600 hover:text-red-800 font-bold cursor-pointer",
                  tagInputField:
                    "w-full p-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none",
                }}
                removeComponent={RemoveComponent}
              />
            </label>

            <button
              onClick={() => {
                setIsEditing(false);
                handleSave();
              }}
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
