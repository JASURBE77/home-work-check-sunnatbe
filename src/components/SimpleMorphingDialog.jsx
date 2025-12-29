// SimpleMorphingDialog.jsx
import React, { useState } from 'react';

export default function SimpleMorphingDialog({ triggerText, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border border-gray-300 rounded p-2"
      >
        {triggerText}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[500px] max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✖
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
