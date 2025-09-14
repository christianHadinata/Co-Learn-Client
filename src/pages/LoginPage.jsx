import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";
import { toast } from "react-toastify";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();

  const hasToastShown = useRef(false); // ngakalin react strict mode, biar toast nya ga muncul 2x

  useEffect(() => {
    if (location.state?.successMessage && !hasToastShown.current) {
      toast.success(location.state.successMessage);
      hasToastShown.current = true;

      // biar kalau di refresh, ga muncul lg notif nya
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email && !password) {
      setError("Please enter email and password");
      return;
    } else if (!email) {
      setError("Please enter email");
      return;
    } else if (!password) {
      setError("Please enter password");
      return;
    }

    //debug
    console.log("Login submitted");
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
        <div className="login-card bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col w-full md:w-1/2 xl:w-1/3 2xl:w-1/3 3xl:w-1/4 mx-auto md:p-10 2xl:p-12 3xl:p-14 ">
          <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
            <div>
              <img
                src="https://i.pinimg.com/736x/55/e7/f3/55e7f3d50ec02281323bf2aac8b1ed46.jpg"
                width="50"
                alt="Logo"
              />
            </div>
            <h1 className="text-3xl font-bold  text-[#4B5563] my-auto">
              Log In
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="pb-2">
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

            <div className="pb-6">
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

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full text-[#FFFFFF] bg-[#574ff2] focus:outline-2 focus:outline-offset-2 focus:outline-[#3731ab] active:bg-[#3731ab] hover:bg-[#3731ab]  font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 cursor-pointer"
            >
              Log In
            </button>
            <div className="text-sm font-light text-[#6B7280] flex items-center justify-center">
              <p>
                New to CoLearn?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#4F46E5] hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
