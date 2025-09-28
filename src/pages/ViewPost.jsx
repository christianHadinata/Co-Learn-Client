import { ThumbsUp, ThumbsDown } from "lucide-react";
import bgImage from "../assets/bg-more.png";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockPosts, mockSpaces } from "../mockData";
import MDEditor from "@uiw/react-md-editor";
import { formatDate } from "../utils/formatDate";
import { AxiosInstance } from "../utils/axiosInstance";

export default function ViewPost() {
  const { id, postId } = useParams();
  const [post, setPost] = useState(null);
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState(null); // "up", "down", or null
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  useEffect(() => {
    const fetchDetailPostAndSpace = async () => {
      try {
        const postResult = await AxiosInstance.get(
          `http://localhost:5000/api/v1/posts/get_post/${postId}`
        );

        const postData = postResult.data.data;
        console.log(postData);

        const spaceResult = await AxiosInstance.get(
          `http://localhost:5000/api/v1/spaces/${id}`
        );

        const spaceData = spaceResult.data.data;
        console.log(spaceData);

        if (postData && spaceData) {
          setPost(postData);
          setSpace(spaceData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailPostAndSpace();
  }, [id, postId]);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!isLoading && (!post || !space))
    return (
      <div className="h-screen flex flex-col gap-y-4 justify-center items-center font-semibold ">
        <div className="text-3xl">Post in space doesn't exist</div>
        <Link to={"/"} className="text-2xl text-[#574ff2] underline">
          Back to home
        </Link>
      </div>
    );

  const handleUpvote = () => {
    if (userVote === "up") {
      // remove upvote
      setUpvotes((u) => u - 1);
      setUserVote(null);
    } else {
      setUpvotes((u) => u + 1);
      if (userVote === "down") {
        setDownvotes((d) => d - 1);
      }
      setUserVote("up");
    }
  };

  const handleDownvote = () => {
    if (userVote === "down") {
      // remove downvote
      setDownvotes((d) => d - 1);
      setUserVote(null);
    } else {
      setDownvotes((d) => d + 1);
      if (userVote === "up") {
        setUpvotes((u) => u - 1);
      }
      setUserVote("down");
    }
  };
  return (
    <div className="" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="max-w-[94vw] mx-auto p-6 space-y-10 pt-[6rem] min-h-screen">
        {/* Post Header */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-gray-900 text-m  mb-4">
              <span className="px-2 py-1 mt-0 bg-white text-gray-900 rounded-md">
                From Learning Space:{" "}
                <Link to={`/space/${space?.learning_space_id}`}>
                  <span className="text-[#574ff2] hover:underline font-medium">
                    {space?.space_title}
                  </span>
                </Link>
              </span>
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              {post.post_title}
            </h1>
            <p className="text-gray-600 text-sm">
              by {post.user_name}, {formatDate(post.created_at)}{" "}
            </p>
          </div>
          <button className="px-4 py-2 border bg-blue-100 border-gray-400 rounded-lg text-gray-700 hover:bg-blue-300 cursor-pointer">
            Save as PDF
          </button>
        </div>

        <div className="flex items-center gap-6 my-4 bg-white px-4 py-2 rounded-full w-fit">
          {/* Upvote */}
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 transition cursor-pointer ${
              userVote === "up"
                ? "text-[#574ff2]"
                : "text-gray-600 hover:text-[#574ff2]"
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-medium">{upvotes}</span>
          </button>

          {/* Downvote */}
          <button
            onClick={handleDownvote}
            className={`flex items-center gap-1 transition cursor-pointer ${
              userVote === "down"
                ? "text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
            <span className="text-sm font-medium">{downvotes}</span>
          </button>
        </div>
        <hr className="my-6 mb-0" />

        <div className="bg-white p-6 mb-0">
          <div className="prose max-w-none" data-color-mode="light">
            <MDEditor.Markdown
              source={post.post_body}
              style={{ whiteSpace: "pre-wrap", backgroundColor: "transparent" }}
            />
          </div>
        </div>

        <hr className="my-6 mt-0" />

        {/* Comments Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <p className="text-gray-600">Placeholder for comments…</p>
        </div>
      </div>
    </div>
  );
}
