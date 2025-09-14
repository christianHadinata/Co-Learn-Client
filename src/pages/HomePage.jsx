import React, { useContext } from "react";
import { UserContext } from "../context/User";

export default function Homepage() {
  const { user } = useContext(UserContext);

  return (
    <div className="h-screen flex justify-center items-center">
      {" "}
      {user ? (
        <h1 className="text-5xl font-semibold">Hello, {user.user_name}!</h1>
      ) : (
        <h1 className="text-5xl font-semibold">Welcome to the Homepage</h1>
      )}
    </div>
  );
}
