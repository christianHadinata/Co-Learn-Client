import React, { useState, useEffect, useContext } from "react";
import bgImage from "../assets/bg-more.png";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";
import { mockSpaces, mockPosts } from "../mockData";
import MDEditor from "@uiw/react-md-editor";
export default function createPost() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [space, setSpace] = useState(null);
  const [markdownValue, setMarkdownValue] = useState();
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    //     const fetchDetailSpaceData = async () => {
    //       try {
    //         const result = await AxiosInstance.get(
    //           `http://localhost:5000/api/v1/spaces/${id}`
    //         );

    //         const data = result.data.data;

    //         setSpace(data);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };

    //     const fetchRelatedSpaceData = async () => {
    //       try {
    //         const result = await AxiosInstance.get(
    //           `http://localhost:5000/api/v1/spaces/related/${id}`
    //         );

    //         const data = result.data.data;

    //         console.log(data);
    //         setRelatedSpaces(data);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
    const found = mockSpaces.find((s) => s.id === Number(id)); //cari space di mock
    if (found) {
      //masukin isinya
      const posts = mockPosts.filter((p) => p.spaceId === found.id);
      setSpace({ ...found, posts });
    } else {
      setSpace(null);
    }

    // fetchDetailSpaceData();
    // fetchRelatedSpaceData();
  }, [id]);

  if (!space) return <div className="p-10">Loading…</div>; //biar tunggu space terisi dulu (fetch data & udh ga null) sebelum page dirender

  const handleCreatePost = () => {
    if (!title && !markdownValue) {
      setError("Please enter post title and body");
      return;
    } else if (!title) {
      setError("Please enter post title");
      return;
    } else if (!markdownValue) {
      setError("Please enter post body");
      return;
    }
    setError("");

    // 1. buat id post
    const newId = mockPosts.length
      ? Math.max(...mockPosts.map((p) => p.id)) + 1
      : 1;

    // 2.buat objek post
    const newPost = {
      id: newId,
      spaceId: space.id,
      title: title,
      author: user.name,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      content: markdownValue,
    };

    // 3. masukkan ke mock
    mockPosts.push(newPost);

    // 4. update id post di space
    const spaceIndex = mockSpaces.findIndex((s) => s.id === space.id);
    if (spaceIndex !== -1) {
      mockSpaces[spaceIndex].posts.push(newId);
    }

    // 5. update local state so React re-renders
    setSpace((prev) => ({
      ...prev,
      posts: [...prev.posts, newPost],
    }));

    // clear editor
    setTitle("");
    setMarkdownValue("");
    alert("Post created!");
    navigate(`/space/${id}`);
  };

  return (
    <div className="bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="flex flex-col w-full justify-start min-h-screen">
        <div className="flex flex-col md:flex-row p-6  gap-6 mt-16 pb-2 mb-2 min ">
          {/* Panel Editor */}
          <div className="flex-1 flex flex-col  bg-[#f8fafb70] rounded-lg shadow-lg p-6 min-h-[calc(100vh*9/12)] ">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Title</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-gray-300 mb-6 pb-2 focus:outline-none focus:border-blue-500"
              placeholder="Post Title"
            />
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Body</h2>
            <div className="flex-1" data-color-mode="light">
              <MDEditor
                value={markdownValue}
                onChange={setMarkdownValue}
                preview="edit"
              />
            </div>
          </div>

          {/* Panel Pratinjau */}
          <div
            className="flex-1 flex flex-col   bg-[#fcfeff]  rounded-lg shadow-lg p-6  h-[calc(100vh*9/12)] "
            data-color-mode="light"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Preview:
            </h2>
            <div className="overflow-y-auto">
              <MDEditor.Markdown
                source={markdownValue}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 p-2">
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="cursor-pointer px-4 py-2  bg-[#574ff2] text-white rounded-lg hover:bg-[#3731ab]"
            type="button"
            onClick={handleCreatePost}
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
}
