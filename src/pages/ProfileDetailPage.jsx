import { useEffect, useState } from "react";
import { AxiosInstance } from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import React from "react";
import "./style.css";
import defaultProfileImage from "../assets/default-profile.jpg";
import bgimg from "../assets/bg-more.png";
export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    biography: "",
    country: "",
    interests: [],
  });

  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  const { user_id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await AxiosInstance.get(
        `http://localhost:5000/api/v1/users/view_user_profile/${user_id}`
      );
      console.log(data);

      const {
        user_name,
        user_biography,
        user_country,
        user_interests,
        user_photo_url,
      } = data.data;

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
      setProfilePhotoUrl(user_photo_url);
    };

    fetchProfile();
  }, []);

  return (
    <React.Fragment>
      {/* profile card */}
      <div
        className="absolute w-full min-h-screen flex justify-center items-center z-10 bg-center"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-xl p-8 w-96 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="flex justify-center mb-6">
              <div className="profile-picture cursor-default select-none">
                <img
                  src={
                    profilePhotoUrl
                      ? `http://localhost:5000/${profilePhotoUrl}`
                      : defaultProfileImage
                  }
                  alt="User"
                  className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                />
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </React.Fragment>
  );
}
