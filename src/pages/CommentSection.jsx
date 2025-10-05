import React, { useContext, useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Link, useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { AxiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { UserContext } from "../context/User";
import defaultProfileImage from "../assets/default-profile.jpg";
// import { mockComments } from "../mockData";
export default function CommentSection() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(user);
    const fetchComments = async () => {
      try {
        const result = await AxiosInstance.get(
          `http://localhost:5000/api/v1/posts/get_comments/${postId}`
        );

        const data = result.data.data;
        console.log(data);

        if (data) {
          setComments(data);
        }
      } catch (err) {
        console.error("Gagal memuat komentar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [user, postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment can't be empty!");
      return;
    }
    if (!user) {
      toast.error("Login required to post a comment!");
      return;
    }
    try {
      const { data } = await AxiosInstance.post(
        `http://localhost:5000/api/v1/posts/create_comment/${postId}`,
        {
          comment_body: newComment,
        }
      );

      console.log(data);

      if (data.success === true) {
        toast.success("Comment posted successfully.");
        setComments((prev) => [data.data, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Gagal menambah komentar:", err);
    }
  };

  const handleVote = async (comment_id, new_vote_type) => {
    if (!user) {
      toast.error("Login required to vote!");
      return;
    }

    try {
      const { data } = await AxiosInstance.post(
        `http://localhost:5000/api/v1/posts/vote_comment/${comment_id}`,
        {
          vote_type: new_vote_type,
        }
      );
      console.log(data);

      if (data.success === true) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.comment_id === comment_id) {
              const prevVoteType = comment.current_user_vote_type;
              let upvote = parseInt(comment.upvote_count) || 0;
              let downvote = parseInt(comment.downvote_count) || 0;
              let nextVoteType = null;

              // kalau sama, berarti mencabut vote
              if (prevVoteType === new_vote_type) {
                if (new_vote_type === "upvote") {
                  upvote--;
                }
                if (new_vote_type === "downvote") {
                  downvote--;
                }
                // hapus jenis vote
                nextVoteType = null;

                // selain itu, maka ubah jenis vote, misal upvote jd downvote, atau downvote jd upvote
              } else {
                // kurangi count di vote yg lama
                if (prevVoteType === "upvote") {
                  upvote--;
                }
                if (prevVoteType === "downvote") {
                  downvote--;
                }

                // Tambahkan vote baru
                if (new_vote_type === "upvote") {
                  upvote++;
                }
                if (new_vote_type === "downvote") {
                  downvote++;
                }

                // ganti jenis vote
                nextVoteType = new_vote_type;
              }
              return {
                ...comment,
                upvote_count: upvote,
                downvote_count: downvote,
                current_user_vote_type: nextVoteType,
              };
            }
            return comment;
          })
        );
      }
    } catch (err) {
      console.error("Gagal melakukan voting:", err);
      toast.error("Failed to Vote. Try Again!");
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
          height={200}
          placeholder="Tulis komentar..."
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handlePostComment}
            className="px-4 py-2 bg-[#574ff2] text-white rounded-md hover:bg-[#463ce6] cursor-pointer"
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-white p-4 rounded-md shadow-sm border"
            >
              {/* Header Comment */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/view-profile/${comment.user_id}`}
                    key={comment.user_id}
                  >
                    <img
                      src={
                        comment.user_photo_url != null
                          ? `http://localhost:5000/${comment.user_photo_url}`
                          : defaultProfileImage
                      }
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <span className="font-semibold block">
                      {comment.user_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <MDEditor.Markdown
                source={comment.comment_body}
                style={{ background: "transparent" }}
              />

              {/* Voting Section */}
              <div className="flex gap-4 items-center mt-3 text-gray-600">
                <button
                  onClick={() => handleVote(comment.comment_id, "upvote")}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${
                    comment.current_user_vote_type === "upvote"
                      ? "text-blue-600"
                      : "hover:text-blue-600"
                  }`}
                >
                  <ThumbsUp size={15} />
                  <span>{comment.upvote_count}</span>
                </button>

                <button
                  onClick={() => handleVote(comment.comment_id, "downvote")}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${
                    // Jika user_vote_type adalah 'downvote', gunakan warna merah
                    comment.current_user_vote_type === "downvote"
                      ? "text-red-600"
                      : "hover:text-red-600"
                  }`}
                >
                  <ThumbsDown size={15} />
                  <span>{comment.downvote_count}</span>
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
