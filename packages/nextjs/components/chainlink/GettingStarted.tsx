"use client";

import { ReactNode, useState } from "react";

interface GettingStartedProps {
  introduction: ReactNode;
  steps: ReactNode;
  details: ReactNode;
}

const GettingStarted: React.FC<GettingStartedProps> = ({ introduction, steps, details }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="cursor-pointer flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <button className="btn btn-outline btn-sm">{isOpen ? "Hide" : "Show"}</button>
      </div>
      {isOpen && (
        <div className="mt-4">
          <div className="mb-4">
            <p>{introduction}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">Steps</h3>
              <ol className="list-decimal list-inside space-y-2">{steps}</ol>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">Details</h3>
              <ul className="list-disc list-inside space-y-2">{details}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GettingStarted;
