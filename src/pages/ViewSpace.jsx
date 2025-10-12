import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/User";
import bgImage from "../assets/bg-less2.png";
import Card from "../components/Card";
import { mockSpaces, mockPosts } from "../mockData";

import PostsList from "../components/PostsList";
import ActiveUsersList from "../components/ActiveUsersList";
import { AxiosInstance } from "../utils/axiosInstance";
import { formatDate } from "../utils/formatDate.js";
import { toast } from "react-toastify";

export default function ViewSpace() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [space, setSpace] = useState(null);
  const [relatedSpaces, setRelatedSpaces] = useState([]);
  const [isJoinedSpace, setIsJoinedSpace] = useState(false);
  const [posts, setPosts] = useState([]);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchDetailSpaceData = async () => {
      try {
        const result = await AxiosInstance.get(
          `http://localhost:5000/api/v1/spaces/${id}`
        );

        const data = result.data.data;
        console.log(data);

        setSpace(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRelatedSpaceData = async () => {
      try {
        const result = await AxiosInstance.get(
          `http://localhost:5000/api/v1/spaces/related/${id}`
        );

        const data = result.data.data;

        console.log(data);
        setRelatedSpaces(data);
      } catch (error) {
        console.log(error);
      }
    };
    // const found = mockSpaces.find((s) => s.id === Number(id)); //cari space di mock
    // if (found) {
    //   //masukin isinya
    //   const posts = mockPosts.filter((p) => p.spaceId === found.id);
    //   setSpace({ ...found, posts });
    // } else {
    //   setSpace(null);
    // }

    const fetchIsJoinedSpace = async () => {
      try {
        const result = await AxiosInstance.get(
          `http://localhost:5000/api/v1/spaces/${id}/status`
        );

        const data = result.data.data;

        setIsJoinedSpace(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPosts = async () => {
      try {
        const result = await AxiosInstance.get(
          `http://localhost:5000/api/v1/spaces/${id}/posts`
        );

        const listPost = result.data.data;

        console.log(listPost);

        setPosts(listPost);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetailSpaceData();
    fetchRelatedSpaceData();
    fetchIsJoinedSpace();
    fetchPosts();
  }, [id]);

  const handleJoinToggle = async () => {
    if (!isJoinedSpace) {
      // belum join -> mau join
      try {
        const { data } = await AxiosInstance.post(
          `http://localhost:5000/api/v1/spaces/${id}/join`
        );

        if (data.success === true) {
          setIsJoinedSpace((prev) => !prev);
          toast.success("Success! Joined to Space");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // udah join -> mau leave
      try {
        const { data } = await AxiosInstance.post(
          `http://localhost:5000/api/v1/spaces/${id}/leave`
        );

        console.log(data.success);

        if (data.success === true) {
          setIsJoinedSpace((prev) => !prev);
          toast.success("Success! Left from Space");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (!space) return <div className="p-10">Loading…</div>; //biar tunggu space terisi dulu (fetch data & udh ga null) sebelum page dirender

  return (
    <main
      className="max-w-[100vw] mx-auto  p-10 space-y-10 pt-[6rem] bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 ">
        <div>
          <h1 className="text-3xl font-bold">{space.space_title}</h1>
          <p className="text-sm text-gray-500 pt-2">by: {space.creator}</p>
        </div>
        {user ? (
          <button
            onClick={handleJoinToggle}
            className={`px-4 py-2 rounded-lg cursor-pointer text-white transition 
                        ${
                          isJoinedSpace
                            ? "bg-red-600 hover:bg-red-700"
                            : " bg-[#574ff2] hover:bg-[#3731ab]"
                        }`}
          >
            {isJoinedSpace ? "Leave" : "Join"}
          </button>
        ) : (
          <Link
            to="/signup"
            className="px-4 py-2  bg-[#574ff2] text-white rounded-lg hover:bg-[#3731ab] cursor-pointer"
          >
            Sign up to Join
          </Link>
        )}
      </section>

      {/* Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border-b pb-6">
          {/* Thumbnail */}
          <div className="md:col-span-1">
            <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden bg-gray-200">
              {space.space_photo_url ? (
                <img
                  src={`http://localhost:5000/${space.space_photo_url}`}
                  alt={space.space_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Overview text */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-700">{space.space_description}</p>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section>
        <h3 className="font-semibold mb-4">Prerequisites</h3>
        <div className="flex flex-wrap gap-2">
          {space.prerequisites?.length > 0 ? (
            space.prerequisites.map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No prerequisites listed.</p>
          )}
        </div>
      </section>

      {/* Grid: Active Users + Posts */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Active users */}
        <div className="md:col-span-1 space-y-8 min-h-[150px]">
          <h3 className="font-semibold mb-4">Active Users</h3>
          {space.activeUsers.length > 0 ? (
            <ActiveUsersList users={space.activeUsers} />
          ) : (
            <div className="text-gray-500 flex  h-full">
              No active users yet.
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="md:col-span-2 min-h-[150px]">
          {posts.length > 0 ? (
            <div className="flex flex-col h-full ">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Posts</h3>
                {!!user && isJoinedSpace ? (
                  <Link to={`/space/${id}/post/new`}>
                    <button className="cursor-pointer px-4 py-2  bg-[#574ff2] text-white rounded-lg hover:bg-[#3731ab]">
                      + New Post
                    </button>
                  </Link>
                ) : (
                  <span className="text-gray-500">Join to Create Post</span>
                )}
              </div>
              <PostsList posts={posts} />
            </div>
          ) : (
            <div className="flex flex-col h-full ">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Posts</h3>
                {!!user && isJoinedSpace ? (
                  <Link to={`/space/${id}/post/new`}>
                    <button className="cursor-pointer px-4 py-2  bg-[#574ff2] text-white rounded-lg hover:bg-[#3731ab]">
                      + New Post
                    </button>
                  </Link>
                ) : (
                  <span className="text-gray-500">Join to Create Post</span>
                )}
              </div>
              <p className="text-gray-500">No posts yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Spaces */}
      <section className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Related Learning Spaces</h3>
        {relatedSpaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedSpaces.map((relSpace) => {
              return (
                <Card
                  key={relSpace.learning_space_id}
                  id={relSpace.learning_space_id}
                  thumbnail={relSpace.space_photo_url}
                  title={relSpace.space_title}
                  members={relSpace.member_count}
                  lastUpdate={formatDate(relSpace.last_updated_at)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No related spaces found.</p>
        )}
      </section>
    </main>
  );
}
