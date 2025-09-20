import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../context/User";
import Card from "../components/Card";
import { mockSpaces, mockPosts } from "../mockData";

import PostsList from "../components/PostsList";
import ActiveUsersList from "../components/ActiveUsersList";

export default function ViewSpace() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [space, setSpace] = useState(null);

  useEffect(() => {
    const found = mockSpaces.find((s) => s.id === Number(id)); //cari space di mock
    if (found) {
      //masukin isinya
      const posts = mockPosts.filter((p) => p.spaceId === found.id);
      setSpace({ ...found, posts });
    } else {
      setSpace(null);
    }
  }, [id]);

  if (!space) return <div className="p-10">Loading…</div>; //biar tunggu space terisi dulu (fetch data & udh ga null) sebelum page dirender

  return (
    <main className="max-w-[92vw] mx-auto p-6 space-y-10 pt-[6rem]">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 ">
        <div>
          <h1 className="text-3xl font-bold">{space.title}</h1>
          <p className="text-sm text-gray-500">by: {space.creator}</p>
        </div>
        {user ? (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-[#3731ab] hover:cursor-pointer">
            Join
          </button>
        ) : (
          <Link
            to="/signup"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-[#3731ab] cursor-pointer"
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
              {space.thumbnail ? (
                <img
                  src={space.thumbnail}
                  alt={space.title}
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
            <p className="text-gray-700">{space.overview}</p>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section>
        <h3 className="font-semibold mb-4">Prerequisites</h3>
        <div className="flex flex-wrap gap-2">
          {space.prerequisites.length > 0 ? (
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
          {space.posts.length > 0 ? (
            <PostsList posts={space.posts} />
          ) : (
            <div className="flex flex-col h-full ">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Posts</h3>
                {!!user && (
                  <button className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-[#3731ab]">
                    + New Post
                  </button>
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
        {space.related.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {space.related.map((relSpaceId) => {
              const relSpace = mockSpaces.find((s) => s.id === relSpaceId);
              return (
                <Card
                  key={relSpace.id}
                  id={relSpace.id}
                  thumbnail={relSpace.thumbnail}
                  title={relSpace.title}
                  members={relSpace.members}
                  lastUpdate={relSpace.lastUpdate}
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
