import React, { useContext, useState, useEffect } from "react";
import Card from "../components/Card";
import { UserContext } from "../context/User";
import { Link } from "react-router-dom";

export default function Homepage() {
  const { user } = useContext(UserContext);
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    // hardcode/mock karena belom ada data
    const mockSpaces = [
      {
        id: 1,
        thumbnail: "https://placehold.co/600x400",
        title: "React Basics",
        members: 17,
        lastUpdate: "5 September 2025",
      },
      {
        id: 2,
        thumbnail: "https://placehold.co/600x400",
        title: "Advanced JS",
        members: 24,
        lastUpdate: "5 September 2025",
      },
      {
        id: 3,
        thumbnail: "https://placehold.co/600x400",
        title: "Machine Learning",
        members: 30,
        lastUpdate: "5 September 2025",
      },
    ];
    setSpaces(mockSpaces);
  }, []);

  return (
    <main className="p-10  pb-[20rem]">
      <section className="flex flex-col justify-center items-center min-h-[66vh]">
        <h1 className="text-center text-2xl md:text-3xl font-bold ">
          {user ? (
            <>
              Join a{" "}
              <a
                href="#learning-space"
                className="text-[#574ff2]hover:underline"
              >
                learning space
              </a>{" "}
              below
            </>
          ) : (
            <>
              <Link to="/signup" className="text-[#574ff2] hover:underline">
                Sign Up
              </Link>{" "}
              to start learning
            </>
          )}
        </h1>
      </section>
      {/* Co-Learning Spaces */}
      <section id="learning-space" className="relative px-4 scroll-mt-16">
        <h2 className="text-xl font-semibold mb-6 text-center pb-5 pt-10">
          Co-Learning Spaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {spaces.map((space) => (
            <Card
              key={space.id}
              thumbnail={space.thumbnail}
              title={space.title}
              members={space.members}
              lastUpdate={space.lastUpdate}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

//   return (
//     <div className="h-screen flex justify-center items-center">
//       {" "}
//       {user ? (
//         <h1 className="text-5xl font-semibold">Hello, {user.user_name}!</h1>
//       ) : (
//         <h1 className="text-5xl font-semibold">Welcome to the Homepage</h1>
//       )}
//     </div>
//   );
// }
