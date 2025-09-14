import React, { useContext } from "react";
import { UserContext } from "../context/User";

export default function Homepage() {
  const { user } = useContext(UserContext);

  return (
    <div>
      {" "}
      {user ? (
        <h1>Hello, {user.user_name}!</h1>
      ) : (
        <h1>Welcome to the Homepage</h1>
      )}
    </div>
  );
}
