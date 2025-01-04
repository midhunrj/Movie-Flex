import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const LocationModal = ({ isOpen, onClose, onLocationSelect }) => {
    const [searchQuery, setSearchQuery] = useState("");
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center", children: _jsxs("div", { className: "bg-white p-6 rounded shadow-lg max-w-md w-full", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "Set Your Location" }), _jsx("input", { type: "text", placeholder: "Enter city name", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full p-2 border border-gray-300 rounded" }), _jsx("button", { onClick: () => {
                        onLocationSelect(searchQuery);
                        onClose();
                    }, className: "mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700", children: "Set Location" })] }) }));
};
export default LocationModal;
