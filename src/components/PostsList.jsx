import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
export default function PostsList({ posts }) {
  return (
    <div className="space-y-4">
      {/* Header: judul + tombol di satu baris */}
      {console.log(posts)}

      {posts.map((post) => (
        <Link
          key={post.post_id}
          to={`/space/${post.learning_space_id}/post/${post.post_id}`}
          className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl
                     transition transform hover:scale-102 p-4 flex flex-col
                     cursor-pointer"
        >
          <h4 className="text-lg font-semibold mb-1">{post.post_title}</h4>
          <p className="text-sm text-gray-600">
            by {post.user_name} • {formatDate(post.created_at)}
          </p>
        </Link>
      ))}
    </div>
  );
}
