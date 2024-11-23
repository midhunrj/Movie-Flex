import React, { useState } from "react";

const LocationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
}> = ({ isOpen, onClose, onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Set Your Location</h3>
        <input
          type="text"
          placeholder="Enter city name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => {
            onLocationSelect(searchQuery);
            onClose();
          }}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Set Location
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
