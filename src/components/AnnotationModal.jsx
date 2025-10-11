import React, { useState, useRef, useEffect } from "react";

export default function AnnotationModal({ highlightedText, onSave, onClose }) {
  const [annotationText, setAnnotationText] = useState("");
  const modalRef = useRef(null);

  const handleSave = () => {
    onSave(annotationText);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)] backdrop-blur-xs"
      onClick={onClose} // klo klik area gelap, nnti dia nutup modalnya
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 m-4"
        onClick={(e) => e.stopPropagation()} // biar klo klik" di modal, ga nutup modal
      >
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Create Annotation
        </h3>

        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-[#574ff2] rounded">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Highlighted Text:
          </p>
          <p className="italic text-gray-800 text-base">{highlightedText}</p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="annotation-note"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Thoughts (Optional)
          </label>
          <textarea
            id="annotation-note"
            rows="4"
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#574ff2]"
            placeholder="Enter your notes or comments about this text..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#574ff2] text-white rounded-md hover:bg-[#463ce6] transition font-medium"
          >
            Save Annotation
          </button>
        </div>
      </div>
    </div>
  );
}
