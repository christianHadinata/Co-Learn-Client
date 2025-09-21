import { useEffect, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { AxiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const RemoveComponent = ({ onRemove, className }) => {
  return (
    <button onClick={onRemove} className={className}>
      x
    </button>
  );
};

export default function CreateLearningSpace() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    prerequisites: [],
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [spacePhotoFile, setSpacePhotoFile] = useState("");

  // untuk ngakalin biar bisa upload foto yang sama lagi, setelah submit form (no refresh)
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddition = (tag) => {
    setForm((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, tag],
    }));
  };

  const handleDelete = (i) => {
    setForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, index) => index !== i),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
      setSpacePhotoFile(file);
    }
  };

  const handleSubmit = async () => {
    console.log("Form submitted:", {
      ...form,
      prerequisites: form.prerequisites.map((t) => t.text),
      thumbnail,
      spacePhotoFile,
    });

    try {
      const formData = new FormData();
      formData.append("space_photo", spacePhotoFile);
      formData.append("space_title", form.title);
      formData.append("space_description", form.description);
      formData.append(
        "learning_space_prerequisites",
        JSON.stringify(form.prerequisites.map((t) => t.text))
      );
      const { data } = await AxiosInstance.post(
        `http://localhost:5000/api/v1/spaces/create_learning_space`,
        formData
      );

      console.log(data);

      if (data.success === true) {
        setForm({
          title: "",
          description: "",
          prerequisites: [],
        });
        setThumbnail(null);
        setSpacePhotoFile("");
        setFileInputKey(Date.now());
        toast.success("Success! Learning Space Created");
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Error! Please Try Again...");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-6 text-center">
          Create New Learning Space
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Form Inputs */}
          <div className="flex flex-col space-y-4">
            <label className="block">
              <span className="text-gray-700 text-sm font-medium">Title</span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter title"
                className="mt-1 block w-full p-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 text-sm font-medium">
                Description
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows="3"
                className="mt-1 block w-full p-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 text-sm font-medium">
                Prerequisites: Tags
              </span>
              <ReactTags
                tags={form.prerequisites}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                delimiters={delimiters}
                placeholder="Add prerequisites..."
                inputFieldPosition="bottom"
                classNames={{
                  tag: "inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1",
                  remove:
                    "ml-2 text-red-600 hover:text-red-800 font-bold cursor-pointer",
                  tagInputField:
                    "w-full mt-1 p-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400",
                }}
                removeComponent={RemoveComponent}
              />
            </label>
          </div>

          {/* Right Side: Thumbnail Upload */}
          <div className="flex flex-col space-y-4">
            <span className="text-gray-700 text-sm font-medium">
              Thumbnail Upload
            </span>
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Preview"
                  className="h-40 object-cover rounded"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <p className="mb-2">Browse | Upload Image</p>
                  <svg
                    className="w-12 h-12 mx-auto text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 15a4 4 0 014-4h.82a2 2 0 001.58-.79l1.9-2.53a2 2 0 013.22 0l1.9 2.53A2 2 0 0016.18 11H17a4 4 0 014 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1z"
                    />
                  </svg>
                </div>
              )}
              <input
                type="file"
                key={fileInputKey}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full text-white bg-[#574ff2] hover:bg-[#3731ab] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors cursor-pointer"
        >
          Create Space
        </button>
      </div>
    </div>
  );
}
