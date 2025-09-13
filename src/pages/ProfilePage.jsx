import { useState } from "react";
import "./ProfilePage.css";

import userIcon from "../assets/icon.jpg";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Lorem ipsum Lorem ipsum",
    biography: "Lorem ipsum lorem ipsum",
    country: "Lorem ipsum Lorem ipsum",
    interests: ["coding", "reading", "gaming"],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestsChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      interests: e.target.value.split(",").map((i) => i.trim()),
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <img src={userIcon} alt="User" />
        </div>

        {!isEditing ? (
          <>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Biography:</strong> {profile.biography}
            </p>
            <p>
              <strong>Country:</strong> {profile.country}
            </p>
            <p>
              <strong>Interests:</strong>{" "}
              {profile.interests.map((i, idx) => (
                <span key={idx} className="tag">
                  {i}
                </span>
              ))}
            </p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        ) : (
          <>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Biography:
              <input
                type="text"
                name="biography"
                value={profile.biography}
                onChange={handleChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
              />
            </label>
            <label>
              Interests (pisahkan dengan koma):
              <input
                type="text"
                value={profile.interests.join(", ")}
                onChange={handleInterestsChange}
              />
            </label>
            <button onClick={() => setIsEditing(false)}>Save</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
