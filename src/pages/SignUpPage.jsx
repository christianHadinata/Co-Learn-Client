import React, { useState } from "react";
import "./style.css";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email && !password && !name && !confirmPassword) {
      setError("Please enter all of the information");
      return;
    } else if (!email) {
      setError("Please enter email ");
      return;
    } else if (!password) {
      setError("Please enter password");
      return;
    } else if (!name) {
      setError("Please enter name ");
      return;
    } else if (!confirmPassword) {
      setError("Please enter password confirmation");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log("Register submitted");
  };

  return (
    <React.Fragment>
      {/* Background */}
      <div className="gradient-bg absolute inset-0 -z-10">
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive"></div>
        </div>
      </div>

      {/* Card */}
      <div className="absolute flex items-center justify-center min-h-full min-w-full z-10 ">
        <div className="login-card bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col w-full md:w-1/2 xl:w-1/3 2xl:w-1/3 3xl:w-1/4 mx-auto md:p-10 2xl:p-12 3xl:p-14 pt-2 pb-2">
          <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
            <div>
              <img
                src="https://i.pinimg.com/736x/55/e7/f3/55e7f3d50ec02281323bf2aac8b1ed46.jpg"
                width="50"
                alt="Logo"
              />
            </div>
            <h1 className="text-3xl font-bold  text-[#4B5563] my-auto">
              Sign Up
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="pb-1">
              <label
                for="name"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Name:
              </label>

              <div className="relative text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-signature-icon lucide-signature"
                  >
                    <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
                    <path d="M3 21h18" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                  placeholder="user@gmail.com"
                />
              </div>
            </div>
            <div className="pb-1">
              <label
                for="email"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Email:
              </label>

              <div className="relative text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-mail"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                  placeholder="user@gmail.com"
                />
              </div>
            </div>

            <div className="pb-1">
              <label
                for="password"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Password:
              </label>
              <div className="relative text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-square-asterisk"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M12 8v8"></path>
                    <path d="m8.5 14 7-4"></path>
                    <path d="m8.5 10 7 4"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  id="password"
                  placeholder="••••••••••"
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                />
              </div>
            </div>

            <div className="pb-6">
              <label
                for="confirmpassword"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Confirm Password:
              </label>
              <div className="relative text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-square-asterisk"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M12 8v8"></path>
                    <path d="m8.5 14 7-4"></path>
                    <path d="m8.5 10 7 4"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name="confirmpassword"
                  id="confirmpassword"
                  placeholder="••••••••••"
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                />
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full text-[#FFFFFF] bg-[#574ff2] focus:outline-2 focus:outline-offset-2 focus:outline-[#3731ab] active:bg-[#3731ab] hover:bg-[#3731ab]  font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 cursor-pointer"
            >
              Login
            </button>
            <div className="text-sm font-light text-[#6B7280] flex items-center justify-center">
              <p>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-[#4F46E5] hover:underline"
                >
                  Log In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
