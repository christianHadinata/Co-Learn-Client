import React from "react";

export default function AnnotationViewer({ data, onClose }) {
  // ini onclose nnti kepake klo annotationViewer nya mau ttp visible pas mouse nge hover modalnya
  // klo skrg blm kepake, logic nya modalnya ilang kalo udah ga hover text nya

  if (!data.visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className="absolute bg-white p-4 rounded-lg shadow-2xl w-80 border border-gray-200 pointer-events-auto transition duration-300"
        style={{
          top: `${data.y + 15}px`, // ini atur2 aja soal posisinya, biar enakeun keliatannya
          left: `${data.x}px`,
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-semibold text-gray-600">
            {`Annotation`}
          </h4>

          {/* Tombol Close (klo nnti butuh)*/}
          {/* <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 ml-4 p-1 leading-none"
            title="Close"
          >
            &times;
          </button> */}
        </div>

        <div className="mb-3 p-2 bg-yellow-50 rounded">
          <p className="text-sm font-bold text-gray-800 italic">
            "{data.highlightedText}"
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded h-auto overflow-y-auto max-h-40">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {data.annotationText || "No detailed thoughts were added."}
          </p>
        </div>
      </div>
    </div>
  );
}
