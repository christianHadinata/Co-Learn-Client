import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { AxiosInstance } from "../utils/axiosInstance"; 
// import { mockComments } from "../mockData";

export default function CommentSection() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await AxiosInstance.get(`/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Gagal memuat komentar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await AxiosInstance.post(`/comments`, {
        postId: Number(postId),
        content: newComment,
      });

      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Gagal menambah komentar:", err);
    }
  };

  const handleVote = async (id, type) => {
    try {
      await AxiosInstance.patch(`/comments/${id}/vote`, { type });
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            if (type === "up") return { ...c, upvotes: c.upvotes + 1 };
            if (type === "down") return { ...c, downvotes: c.downvotes + 1 };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Gagal melakukan voting:", err);
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* Input Comment */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <MDEditor
          value={newComment}
          onChange={setNewComment}
          height={120}
          placeholder="Tulis komentar..."
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handlePostComment}
            className="px-4 py-2 bg-[#574ff2] text-white rounded-md hover:bg-[#463ce6]"
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-md shadow-sm border"
            >
              {/* Header Comment */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={c.avatar_url || "https://placehold.co/40x40"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold block">{c.user_name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <MDEditor.Markdown
                source={c.content}
                style={{ background: "transparent" }}
              />

              {/* Voting Section */}
              <div className="flex gap-4 items-center mt-3 text-gray-600">
                <button
                  onClick={() => handleVote(c.id, "up")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <ThumbsUp size={15} />
                  <span>{c.upvotes}</span>
                </button>

                <button
                  onClick={() => handleVote(c.id, "down")}
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <ThumbsDown size={15} />
                  <span>{c.downvotes}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">Belum ada komentar.</p>
        )}
      </div>
    </div>
  );
}
