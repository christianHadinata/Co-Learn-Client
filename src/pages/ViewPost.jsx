import { ThumbsUp, ThumbsDown } from "lucide-react";
import bgImage from "../assets/bg-more.png";
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { mockPosts, mockSpaces } from "../mockData";
import MDEditor from "@uiw/react-md-editor";
import { formatDate } from "../utils/formatDate";
import { AxiosInstance } from "../utils/axiosInstance";
import CommentSection from "./CommentSection";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ViewPost() {
  const { id, postId } = useParams();
  const [post, setPost] = useState(null);
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState(null); // "up", "down", or null
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const postContentRef = useRef();

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
  const handleSavePDF = async () => {
    if (!postContentRef.current) return;

    //  pastiin consistent zoom and scroll position
    window.scrollTo(0, 0);

    const input = postContentRef.current;

    // generate canvas from post content
    const canvas = await html2canvas(input, {
      scale: 2 / window.devicePixelRatio, // normalize zoom
      useCORS: true,
      logging: false,
    });

    // use jpg buat type imagenya
    const imgData = canvas.toDataURL("image/jpeg", 0.85);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // custom header (title post and space, creator, date)
    //!!!!!!!!!!!kalau mau hapus sok aja
    //start header
    const marginX = 10;
    const marginTop = 20;
    const lineHeight = 8;
    let currentY = marginTop;

    const title = `Post "${post?.post_title || "Untitled"}"`;
    const subtitle = `from Space "${space?.space_title || "Unknown Space"}"`;
    const authorLine = `by ${post?.user_name || "Anonymous"} (${
      formatDate(post?.created_at) || "Unknown Date"
    })`;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(title, marginX, currentY);
    currentY += lineHeight;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(subtitle, marginX, currentY);
    currentY += lineHeight;

    pdf.setFontSize(11);
    pdf.text(authorLine, marginX, currentY);
    currentY += 6;

    // hr pembatas title dan content
    pdf.setDrawColor(150, 150, 150); // light gray
    pdf.setLineWidth(0.3);
    pdf.line(marginX, currentY, pdfWidth - marginX, currentY);
    //end header

    const contentX = 10; // same as margin
    const contentWidth = pdfWidth - contentX * 2; // avoid cutting sides

    pdf.addImage(
      imgData,
      "JPEG",
      contentX,
      currentY,
      contentWidth,
      pdfHeight,
      "",
      "FAST"
    );

    pdf.save(`${post?.post_title || "post"}.pdf`);
  };

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
          <button
            onClick={handleSavePDF}
            className="px-4 py-2 border bg-blue-100 border-gray-400 rounded-lg text-gray-700 hover:bg-blue-300 cursor-pointer"
          >
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

        <div ref={postContentRef} className="bg-white p-6 mb-0">
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
          <CommentSection />
        </div>
      </div>
    </div>
  );
}
