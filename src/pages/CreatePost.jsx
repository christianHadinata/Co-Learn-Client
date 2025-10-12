import React, { useState, useEffect } from "react";
import bgImage from "../assets/bg-more.png";
import { useParams, Link, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { AxiosInstance } from "../utils/axiosInstance";
export default function CreatePost() {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [markdownValue, setMarkdownValue] = useState();
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailSpaceData();
  }, [id]);

  if (isLoading) return <div className="p-10">Loading…</div>; //biar tunggu space terisi dulu (fetch data & udh ga null) sebelum page dirender
  if (!isLoading && !space)
    return (
      <div className="h-screen flex flex-col gap-y-4 justify-center items-center font-semibold ">
        <div className="text-3xl">Learning Space doesn't exist</div>
        <Link to={"/"} className="text-2xl text-[#574ff2] underline">
          Back to home
        </Link>
      </div>
    );

  const handleCreatePost = async () => {
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

    console.log(title);
    console.log(markdownValue);

    try {
      const { data } = await AxiosInstance.post(
        `http://localhost:5000/api/v1/posts/create_post/${id}`,
        {
          post_title: title,
          post_body: markdownValue,
        }
      );

      console.log(data);

      if (data.success === true) {
        setTitle("");
        setMarkdownValue("");
        const newPostId = data.data?.post_id;
        navigate(`/space/${id}/post/${newPostId}`, {
          state: {
            successMessage: "Success! Post Successfully Created",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="flex flex-col w-full justify-start min-h-screen">
        <div className="flex flex-col md:flex-row p-6  gap-6 mt-16 pb-2 mb-2 min ">
          {/* left side : editor */}
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
                height={500}
              />
            </div>
          </div>

          {/* right : preview*/}
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
