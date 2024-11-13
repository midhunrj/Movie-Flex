import React, { useState } from 'react';

const TierConfigModal = ({ onSave, onCancel, initialConfig }) => {
    const [startLetter, setIdentifier] = useState(initialConfig?.startLetter || '');
    const [order, setOtherConfig] = useState(initialConfig?.order || '');

    const handleSave = () => {
        const configData = { startLetter, order };
        onSave(configData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 ">
                <h2 className="text-xl font-semibold mb-4">Configure Tier</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Identifier</label>
                    <input
                        type="text"
                        value={startLetter}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <select
                        type="text"
                        value={order}
                        onChange={(e) => setOtherConfig(e.target.value)}
                        className="w-full p-2 border rounded"
                    ><option value="ascending">Ascending</option>
                    <option value="descending">descending</option></select>
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

export default TierConfigModal;
