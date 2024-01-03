import React from "react";

export default function NotToaccessOverly({ props }) {
  return (
    <div className="  fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-200 opacity-75 flex flex-col items-center justify-center">
      <div role="" className="  ">
        <span className="sr-only">{props}</span>
      </div>
    </div>
  );
}
