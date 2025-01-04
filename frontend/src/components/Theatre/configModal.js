import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const TierConfigModal = ({ onSave, onCancel, initialConfig }) => {
    const [startLetter, setIdentifier] = useState(initialConfig?.startLetter || '');
    const [order, setOtherConfig] = useState(initialConfig?.order || '');
    const handleSave = () => {
        const configData = { startLetter, order };
        onSave(configData);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-1/3", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Configure Tier" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 text-sm font-bold mb-2", children: "Identifier" }), _jsx("input", { type: "text", value: startLetter, onChange: (e) => setIdentifier(e.target.value), className: "w-full p-2 border rounded" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 text-sm font-bold mb-2", children: "Order" }), _jsxs("select", { value: order, onChange: (e) => setOtherConfig(e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "ascending", children: "Ascending" }), _jsx("option", { value: "descending", children: "Descending" })] })] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx("button", { onClick: onCancel, className: "px-4 py-2 min-h-8 bg-gray-300 rounded", children: "Cancel" }), _jsx("button", { onClick: handleSave, className: "px-4 py-2 min-h-8 bg-blue-500 text-white rounded", children: "Save" })] })] }) }));
};
export default TierConfigModal;
