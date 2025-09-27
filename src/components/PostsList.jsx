import React from "react";
import { Link } from "react-router-dom";
export default function PostsList({ posts }) {
  return (
    <div className="space-y-4">
      {/* Header: judul + tombol di satu baris */}

      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/space/${post.spaceId}/post/${post.id}`}
          className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl
                     transition transform hover:scale-102 p-4 flex flex-col
                     cursor-pointer"
        >
          <h4 className="text-lg font-semibold mb-1">{post.title}</h4>
          <p className="text-sm text-gray-600">
            by {post.author} • {post.date}
          </p>
        </Link>
      ))}
    </div>
  );
}
