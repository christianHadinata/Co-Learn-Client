import { ThumbsUp, ThumbsDown } from "lucide-react";
import bgImage from "../assets/bg-more.png";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { mockPosts, mockSpaces } from "../mockData";
import MDEditor from "@uiw/react-md-editor";
import { formatDate } from "../utils/formatDate";
import { AxiosInstance } from "../utils/axiosInstance";
import CommentSection from "./CommentSection";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UserContext } from "../context/User";
import { toast } from "react-toastify";
import AnnotationModal from "../components/AnnotationModal";
import AnnotationViewer from "../components/AnnotationViewer";

export default function ViewPost() {
  const { id, postId } = useParams();
  const [post, setPost] = useState(null);
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const { user } = useContext(UserContext);

  const [annotations, setAnnotations] = useState([]);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);

  const [annotationIconPosition, setAnnotationIconPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  // nyimpen highlighted text sm posisinya
  const [currentSelection, setCurrentSelection] = useState({
    highlightedText: "",
    startIndex: 0,
    endIndex: 0,
  });

  // ini buat ngebuka pop up klo hover text yg udh di highlight
  const [viewerAnnotation, setViewerAnnotation] = useState({
    visible: false,
    highlightedText: "",
    annotationText: "", // ini buat nampung notes atau comment nya gt nnti
    userName: "",
    x: 0,
    y: 0,
  });

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
          setUpvotes(parseInt(postData.upvote_count) || 0);
          setDownvotes(parseInt(postData.downvote_count) || 0);
          setUserVote(postData.current_user_vote_type || null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnnotations = async () => {
      if (!user || !postId) return;
      try {
        const result = await AxiosInstance.get(
          `http://localhost:5000/api/v1/posts/annotations/${postId}`
        );

        console.log(result.data.data);

        setAnnotations(result.data.data);
      } catch (error) {
        console.error("Failed to fetch annotations:", error);
      }
    };

    fetchDetailPostAndSpace();
    fetchAnnotations();
  }, [id, postId, user]);

  useEffect(() => {
    if (!post || !postContentRef.current || annotations.length === 0) {
      return;
    }

    const markdownOutput =
      postContentRef.current.querySelector(".wmde-markdown") ||
      postContentRef.current.querySelector(".prose");

    console.log(markdownOutput);

    if (!markdownOutput) return;

    const getTextNodes = (root) => {
      const nodes = [];
      const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while (treeWalker.nextNode()) {
        node = treeWalker.currentNode;
        if (node.textContent.trim().length > 0) {
          nodes.push(node);
        }
      }
      console.log(nodes);
      return nodes;
    };

    // hapus dulu, klo ada yg udh ke highlight
    markdownOutput.querySelectorAll(".annotation-highlight").forEach((span) => {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
      parent.normalize();
    });

    // sort dulu annotation nya, pake end index biar bs overlapping, klo start index bakal error ketika overlapping highlight
    const sortedAnnotations = [...annotations].sort(
      (a, b) => b.end_index - a.end_index
    );

    let textNodes = getTextNodes(markdownOutput);
    let totalLength = 0;
    let nodeIndex = 0;

    sortedAnnotations.forEach((anno) => {
      const { start_index, end_index, annotation_text, user_name } = anno;

      let currentLength = 0;
      let startNode = null;
      let endNode = null;
      let startOffset = 0;
      let endOffset = 0;

      for (const node of textNodes) {
        const len = node.textContent.length;
        if (
          start_index >= currentLength &&
          start_index <= currentLength + len
        ) {
          startNode = node;
          startOffset = start_index - currentLength;
        }
        if (end_index >= currentLength && end_index <= currentLength + len) {
          endNode = node;
          endOffset = end_index - currentLength;
          break;
        }
        currentLength += len;
      }

      if (
        startNode &&
        endNode &&
        startNode === endNode &&
        endOffset > startOffset
      ) {
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);

        // highlight manual bungkus pake span, trs set bg yellow
        const highlightSpan = document.createElement("span");
        highlightSpan.style.backgroundColor = "rgb(253, 224, 71)";
        highlightSpan.className = "rounded cursor-pointer annotation-highlight";
        highlightSpan.dataset.id = anno.annotation_id;
        highlightSpan.dataset.text = annotation_text || "(No comment)";
        highlightSpan.dataset.user = user_name || "Anonymous";

        try {
          range.surroundContents(highlightSpan);
          markdownOutput.normalize();
          textNodes = getTextNodes(markdownOutput);
        } catch (e) {
          console.warn("Annotation range error, skipping.", e);
        }
      } else if (startNode && endNode) {
        console.warn(
          "Annotation spans multiple text nodes, skipping for simplicity."
        );
      }
    });

    markdownOutput.querySelectorAll(".annotation-highlight").forEach((el) => {
      // klo mouse nya hover si highlighted text, set data" nya ke state viewerAnnotation
      // biar nnti bisa nampilin text sm annotation nya
      el.onmouseover = (e) => {
        const annotationData = annotations.find(
          (a) => a.annotation_id === parseInt(el.dataset.id)
        );

        const rect = e.currentTarget.getBoundingClientRect();
        setViewerAnnotation({
          visible: true,
          highlightedText: el.textContent,
          annotationText: el.dataset.text,
          userName: el.dataset.user,
          x: rect.left + rect.width / 2,
          y: rect.bottom + window.scrollY,
        });
      };

      el.onmouseout = (e) => {
        setTimeout(() => {
          setViewerAnnotation((prev) => ({ ...prev, visible: false }));
        }, 100);
      };
    });
  }, [post, annotations]);

  // ini buat dapetin text" yg di sorot
  const getSelectionData = (selection) => {
    if (!selection.rangeCount) {
      setAnnotationIconPosition({ x: 0, y: 0, visible: false });
      return null;
    }

    const range = selection.getRangeAt(0);
    const containerElement = postContentRef.current;

    if (
      !containerElement.contains(range.startContainer) ||
      range.collapsed ||
      selection.toString().trim().length === 0
    ) {
      setAnnotationIconPosition({ x: 0, y: 0, visible: false });
      return null;
    }

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(containerElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    let prefixString = preSelectionRange.toString();
    let highlightedText = selection.toString();

    // regex" ini buat bersihin karakter yg nambah index, soalnya nnti ngebaca index nya jd salah klo ga dibersihin sementara
    const cleanPrefix = prefixString.replace(/\n/g, "");
    let startIndex = cleanPrefix.length;
    let endIndex = startIndex + highlightedText.length;

    let leadingWhitespaceMatch = highlightedText.match(/^\s+/);
    if (leadingWhitespaceMatch) {
      let wsLength = leadingWhitespaceMatch[0].length;
      startIndex += wsLength;
      highlightedText = highlightedText.trimStart();
    }

    let trailingWhitespaceMatch = highlightedText.match(/\s+$/);
    if (trailingWhitespaceMatch) {
      highlightedText = highlightedText.trimEnd();
    }

    endIndex = startIndex + highlightedText.length;

    console.log("Final Indices (Corrected):", {
      startIndex,
      endIndex,
      highlightedText,
    });

    return {
      highlightedText: highlightedText,
      startIndex: startIndex,
      endIndex: endIndex,
      rect: range.getBoundingClientRect(),
    };
  };

  const handleSelection = (e) => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
      setAnnotationIconPosition({ x: 0, y: 0, visible: false });
      return;
    }

    const selectionData = getSelectionData(selection);
    console.log(selectionData);
    if (!selectionData) return;

    setCurrentSelection(selectionData);

    const { rect } = selectionData;
    const containerRect = postContentRef.current.getBoundingClientRect();

    setAnnotationIconPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - containerRect.top + 220,
      visible: true,
    });
  };

  const handleIconClick = () => {
    if (!user) {
      toast.error("Login required to create annotations.");
      setAnnotationIconPosition({ x: 0, y: 0, visible: false });
      return;
    }
    setShowAnnotationModal(true);
    setAnnotationIconPosition({ x: 0, y: 0, visible: false });
  };

  const saveAnnotation = async (annotationText) => {
    setShowAnnotationModal(false);

    const payload = {
      ...currentSelection,
      annotation_text: annotationText,
    };

    console.log(payload);

    try {
      const result = await AxiosInstance.post(
        `http://localhost:5000/api/v1/posts/annotations/${postId}`,
        {
          highlighted_text: payload.highlightedText,
          annotation_text: payload.annotation_text,
          start_index: payload.startIndex,
          end_index: payload.endIndex,
        }
      );
      const newAnnotation = result.data.data;

      const updatedAnnotations = [...annotations, newAnnotation];
      setAnnotations(updatedAnnotations);

      toast.success("Annotation saved successfully!");
    } catch (error) {
      console.error("Failed to save annotation:", error);
      toast.error("Failed to save annotation. Please try again.");
    }
  };

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

    //  pastiin consistent zoom dan scroll position, biar pas di capture ga mencong"
    window.scrollTo(0, 0);

    const input = postContentRef.current;
    const canvas = await html2canvas(input, {
      scale: 3,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.scrollHeight,
    });
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
    pdf.setFontSize(12);
    pdf.text(title, marginX, currentY);
    currentY += lineHeight;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(subtitle, marginX, currentY);
    currentY += lineHeight;

    pdf.setFontSize(8);
    pdf.text(authorLine, marginX, currentY);
    currentY += 6;

    // hr pembatas title dan content
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, currentY, pdfWidth - marginX, currentY);

    const zoom = 1.25; // 👈 try 1.2–1.4 for bigger text

    const contentX = 10;
    // ===== FIX: Proper page-splitting =====
    const pageHeightPx =
      (pdf.internal.pageSize.getHeight() * canvas.width) / pdfWidth;
    let position = 0;
    let pageIndex = 0;

    while (position < canvas.height) {
      // Buat potongan canvas baru untuk tiap halaman
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageHeightPx, canvas.height - position);
      const ctx = pageCanvas.getContext("2d");

      ctx.drawImage(
        canvas,
        0,
        position,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const pageData = pageCanvas.toDataURL("image/jpeg", 0.9);
      const pagePdfHeight = (pageCanvas.height * pdfWidth) / canvas.width;

      pdf.addImage(
        pageData,
        "JPEG",
        contentX,
        pageIndex === 0 ? currentY : 0, // cuma halaman pertama yang ada header offset
        pdfWidth - contentX * 2,
        pagePdfHeight,
        "",
        "FAST"
      );

      position += pageHeightPx;
      pageIndex++;
      if (position < canvas.height) pdf.addPage();
    }

    pdf.save(`${post?.post_title || "post"}.pdf`);
  };

  const handleVote = async (new_vote_type) => {
    if (!user) {
      toast.error("Login required to vote on posts.");
      return;
    }

    try {
      const { data } = await AxiosInstance.post(
        `http://localhost:5000/api/v1/posts/vote_post/${postId}`,
        {
          vote_type: new_vote_type,
        }
      );
      console.log(data);

      if (data.success === true) {
        const prevVoteType = userVote;
        let newUpvotes = upvotes;
        let newDownvotes = downvotes;
        let nextVoteType = null;

        // kalau sama, berarti mencabut vote
        if (prevVoteType === new_vote_type) {
          if (new_vote_type === "upvote") {
            newUpvotes--;
          }
          if (new_vote_type === "downvote") {
            newDownvotes--;
          }
          // hapus jenis vote
          nextVoteType = null;

          // selain itu, maka ubah jenis vote, misal upvote jd downvote, atau downvote jd upvote
        } else {
          // kurangi count di vote yg lama
          if (prevVoteType === "upvote") {
            newUpvotes--;
          }
          if (prevVoteType === "downvote") {
            newDownvotes--;
          }

          // Tambahkan vote baru
          if (new_vote_type === "upvote") {
            newUpvotes++;
          }
          if (new_vote_type === "downvote") {
            newDownvotes++;
          }

          // ganti jenis vote
          nextVoteType = new_vote_type;
        }

        setUpvotes(newUpvotes);
        setDownvotes(newDownvotes);
        setUserVote(nextVoteType);
      }
    } catch (err) {
      console.error("Gagal melakukan voting:", err);
      toast.error("Failed to Vote. Try Again!");
    }
  };

  return (
    <div className="" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* ini icon yg muncul seudah highlight text */}
      {annotationIconPosition.visible && (
        <div
          onClick={handleIconClick}
          className="absolute z-50 p-2 bg-indigo-600 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition"
          style={{
            top: `${annotationIconPosition.y}px`,
            left: `${annotationIconPosition.x}px`,
            transform: "translateX(-50%)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />{" "}
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />{" "}
          </svg>{" "}
        </div>
      )}{" "}
      {showAnnotationModal && (
        <AnnotationModal
          highlightedText={currentSelection.highlightedText}
          onSave={saveAnnotation}
          onClose={() => setShowAnnotationModal(false)}
        />
      )}
      <AnnotationViewer
        data={viewerAnnotation}
        onClose={() =>
          setViewerAnnotation((prev) => ({ ...prev, visible: false }))
        }
      />
      <div className="max-w-[94vw] mx-auto p-6 space-y-10 pt-[6rem] min-h-screen">
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
            className="px-4 py-2 bg-[#574ff2] text-white rounded-md hover:bg-[#463ce6] cursor-pointer"
          >
            Save as PDF
          </button>
        </div>

        <div className="flex items-center gap-6 my-4 bg-white px-4 py-2 rounded-full w-fit">
          {/* upvote */}
          <button
            onClick={() => handleVote("upvote")}
            className={`flex items-center gap-1 transition cursor-pointer ${
              userVote === "upvote"
                ? "text-[#574ff2]"
                : "text-gray-600 hover:text-[#574ff2]"
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-medium">{upvotes}</span>
          </button>

          {/* downvote */}
          <button
            onClick={() => handleVote("downvote")}
            className={`flex items-center gap-1 transition cursor-pointer ${
              userVote === "downvote"
                ? "text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
            <span className="text-sm font-medium">{downvotes}</span>
          </button>
        </div>

        <div
          ref={postContentRef}
          className="bg-white p-6 mb-0 relative rounded-lg shadow-sm"
          onMouseUp={handleSelection}
        >
          <div className="prose max-w-none" data-color-mode="light">
            <MDEditor.Markdown
              source={post.post_body}
              style={{ whiteSpace: "pre-wrap", backgroundColor: "transparent" }}
            />
          </div>
        </div>

        <div className="mt-8">
          <CommentSection />
        </div>
      </div>
    </div>
  );
}
