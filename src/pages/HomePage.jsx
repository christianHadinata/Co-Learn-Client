import React, { useContext, useState, useEffect } from "react";
import Card from "../components/Card";
import { UserContext } from "../context/User";
import { Link, useLocation } from "react-router-dom";
// import { mockSpaces } from "../mockData";
import bgImage from "../assets/bg-less.png";

// import bgImage2 from "../assets/bg-less.png";
import { AxiosInstance } from "../utils/axiosInstance";
import { formatDate } from "../utils/formatDate";

import iconHeart from "../assets/icon-heart.png";
import iconChat from "../assets/icon-chat.png";
import iconDoc from "../assets/icon-document.png";
import iconPencil from "../assets/icon-pencil.png";
import iconPerson from "../assets/icon-person.png";
import iconShare from "../assets/icon-share.png";
import iconStar from "../assets/icon-star.png";

export default function Homepage() {
  const { user } = useContext(UserContext);
  const [spaces, setSpaces] = useState([]);
  const location = useLocation();

  useEffect(() => {
    //efek smooth scroll
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchAllSpacesData = async () => {
      try {
        const result = await AxiosInstance.get(
          `http://localhost:5000/api/v1/spaces`
        );

        const data = result.data.data;

        if (data) {
          const sortedData = [...data].sort((a, b) => {
            // sort berdasarkan tanggal last update at descending
            const dateA = new Date(a.last_updated_at);
            const dateB = new Date(b.last_updated_at);

            return dateB.getTime() - dateA.getTime();
          });

          setSpaces(sortedData);
          // setSpaces(data);
        }

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllSpacesData();
    // setSpaces(mockSpaces);
  }, []);

  return (
    <div className="bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <main className="p-10  pb-[20rem]">
        <section className="relative flex flex-col items-center justify-center text-center min-h-[80vh] md:px-16 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={iconHeart}
              alt="Heart"
              className="absolute w-10 md:w-12 top-[25%] left-[15%] animate-float-slow rotate-[10deg]"
            />
            <img
              src={iconChat}
              alt="Chat"
              className="absolute w-10 md:w-12 top-[50%] left-[5%] animate-float rotate-[-10deg]"
            />
            <img
              src={iconDoc}
              alt="Doc"
              className="absolute w-12 md:w-14 top-[20%] right-[20%] animate-float-fast rotate-[15deg]"
            />
            <img
              src={iconPencil}
              alt="Pencil"
              className="absolute w-10 md:w-12 top-[55%] right-[10%] animate-float-slow rotate-[25deg]"
            />
            <img
              src={iconPerson}
              alt="Person"
              className="absolute w-8 md:w-10 bottom-[30%] left-[25%] animate-float rotate-[8deg]"
            />
            <img
              src={iconShare}
              alt="Share"
              className="absolute w-10 md:w-12 bottom-[20%] right-[30%] animate-float-fast rotate-[30deg]"
            />
            <img
              src={iconStar}
              alt="Star"
              className="absolute w-8 md:w-10 bottom-[75%] left-[50%] animate-float rotate-[-15deg]"
            />
          </div>

          {/* hero title */}
          <div className="relative z-10 max-w-2xl px-4 pt-8">
            {user ? (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-[1.5]">
                  Join a <br />
                  <a
                    href="#learning-space"
                    className="text-[#574ff2] hover:underline text-5xl md:text-6xl"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("learning-space");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Learning Space
                  </a>
                  <br />
                  Below
                </h1>
              </>
            ) : (
              <>
                <p className="text-base md:text-lg text-gray-500 mb-2">
                  Your Learning Journey Starts Here
                </p>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-3">
                  <Link
                    to="/signup"
                    className="text-[#574ff2] hover:underline font-extrabold"
                  >
                    Sign Up
                  </Link>
                </h1>
                <p className="text-3xl md:text-4xl font-semibold text-gray-700 mb-2">
                  to start learning
                </p>
                <p className="text-lg text-gray-500 max-w-xl mx-auto">
                  Discover and join spaces to learn, share, and grow with
                  others.
                </p>
              </>
            )}
          </div>

          {/* animasi floating icon */}
          <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-float { animation: float 5s ease-in-out infinite; }
    .animate-float-slow { animation: float 7s ease-in-out infinite; }
    .animate-float-fast { animation: float 3.5s ease-in-out infinite; }
  `}</style>
        </section>

        {/* spaces list*/}
        <section id="learning-space" className="relative px-4 scroll-mt-16">
          <h2 className="text-4xl font-semibold mb-6 text-center py-10 text-gray-700">
            Co-Learning Spaces
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {spaces.map((space) => (
              <Card
                key={space.learning_space_id}
                id={space.learning_space_id}
                thumbnail={space.space_photo_url}
                title={space.space_title}
                members={space.member_count}
                lastUpdate={formatDate(space.last_updated_at)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
