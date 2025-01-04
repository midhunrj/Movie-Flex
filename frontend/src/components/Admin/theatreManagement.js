import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import SidebarMenu from './sidebarMenu';
import { fetchTheatres, blockTheatre, unblockTheatre, approveTheatre, declineTheatre } from '../../redux/admin/adminThunk';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
const TheatreList = () => {
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState(null); // For modal
    const [showModal, setShowModal] = useState(false); // Modal state
    const { isLoading, isError, theatreData, message } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = Array.isArray(theatreData) ? theatreData.slice(indexOfFirstUser, indexOfLastUser) : [];
    // Handle pagination
    const handleNextPage = () => {
        if (currentPage < Math.ceil(theatreData?.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    // Block/Unblock theatre
    const handleBlockUnblock = (theatreId, isBlocked) => {
        if (isBlocked) {
            dispatch(unblockTheatre(theatreId));
        }
        else {
            dispatch(blockTheatre(theatreId));
        }
    };
    // Approve theatre
    const handleApprove = (theatreId) => {
        dispatch(approveTheatre(theatreId));
    };
    // Decline theatre
    const handleDecline = (theatreId) => {
        dispatch(declineTheatre(theatreId));
    };
    // Fetch theatre data
    useEffect(() => {
        dispatch(fetchTheatres());
    }, [dispatch]);
    // Open modal to show details
    const openModal = (theatre) => {
        setSelectedTheatre(theatre);
        setShowModal(true);
    };
    // Close modal
    const closeModal = () => {
        setSelectedTheatre(null);
        setShowModal(false);
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { children: [_jsxs(SidebarMenu, { children: [_jsx("div", { children: _jsx("h1", { className: 'text-wrap font-bold text-blue-500', children: "TheatreList" }) }), _jsxs("table", { className: "min-w-full border-collapse border rounded-lg shadow-lg border-gray-200 mt-4", children: [_jsx("thead", { children: _jsxs("tr", { className: 'rounded-lg border-collapse border border-gray-400  bg-slate-100', children: [_jsx("th", { className: " border-gray-300 p-4", children: "No" }), _jsx("th", { className: " border-gray-300 p-4", children: "Name" }), _jsx("th", { className: " border-gray-300 p-4", children: "Email" }), _jsx("th", { className: " border-gray-300 p-4", children: "Mobile" }), _jsx("th", { className: " border-gray-300 p-4", children: "Status" }), _jsx("th", { className: " border-gray-300 p-4", children: "View Details" }), _jsx("th", { className: " border-gray-300 p-4", children: "Actions" })] }) }), _jsx("tbody", { children: theatreData?.length > 0 ? (theatreData.map((theatre, index) => (_jsxs("tr", { className: "border-t bg-white rounded-lg", children: [_jsx("td", { className: "p-3 text-center", children: index + 1 }), _jsx("td", { className: "p-3", children: theatre.name }), _jsx("td", { className: "p-3", children: theatre.email }), _jsx("td", { className: "p-3", children: theatre.mobile }), _jsx("td", { className: "p-3", children: theatre.is_approved === "Approved" ? (theatre.is_blocked ? (_jsx("span", { className: "text-red-500", children: "Blocked" })) : (_jsx("span", { className: "text-green-500", children: "Active" }))) : (_jsx("span", { className: "text-yellow-500", children: "Pending Approval" })) }), _jsx("td", { className: 'p-3', children: _jsx("button", { className: "px-2 py-1 min-h-8 w-fit h-fit bg-blue-500 text-white rounded-lg", onClick: () => openModal(theatre), children: "View Details" }) }), _jsx("td", { className: "p-3 flex items-center gap-2", children: theatre.is_approved === "Pending" ? (_jsxs(_Fragment, { children: [_jsxs("button", { className: "min-w-min px-2 min-h-8 py-2 bg-green-500 text-white rounded-lg  flex  items-center justify-center gap-1 ", onClick: () => handleApprove(theatre._id), children: [_jsx("span", { children: "Approve " }), _jsx("span", { className: "text-white", children: "\u2714" })] }), _jsxs("button", { className: "min-w-min px-2 min-h-8 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-1", onClick: () => handleDecline(theatre._id), children: [_jsx("span", { children: "  Decline" }), _jsx("span", { className: "text-white", children: " \u2716" })] })] })) : (_jsx("button", { className: `min-h-8 mx-8 h-fit px-2 py-1 ${theatre.is_blocked ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg`, onClick: () => handleBlockUnblock(theatre._id, theatre.is_blocked), children: theatre.is_blocked ? 'Unblock' : 'Block' })) })] }, theatre._id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "p-3 text-center", children: "No theatres found" }) })) })] }), _jsxs("div", { className: "flex justify-center mt-4", children: [_jsx("button", { onClick: handlePreviousPage, disabled: currentPage === 1, className: "px-2 py-1 mx-2 min-h-8 bg-blue-500 text-white rounded  cursor-pointer hover:bg-blue-800", children: "Previous" }), _jsx("span", { className: "px-6 py-1 mx-2 min-h-8  bg-blue-700 rounded text-white", children: currentPage }), _jsx("button", { onClick: handleNextPage, disabled: currentPage >= Math.ceil(theatreData?.length / usersPerPage), className: "px-2 py-1 mx-2 min-h-8 bg-blue-500  text-white rounded cursor-pointer hover:bg-blue-800", children: "Next" })] })] }), showModal && selectedTheatre && (
                // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                // <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
                //   <h2 className="text-2xl font-bold mb-4">Theatre Details</h2>
                _jsx("div", { className: "fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 ", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-1/3", children: [_jsx("h2", { className: "text-2xl mb-4", children: "Theatre Details" }), _jsxs("p", { children: [_jsx("strong", { children: "Name:" }), " ", selectedTheatre.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", selectedTheatre.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Mobile:" }), " ", selectedTheatre.mobile] }), _jsx("div", { className: "mt-4", children: _jsx("img", { src: `/uploads/${selectedTheatre.licenseImage}`, alt: "License", className: "w-full" }) }), _jsx("button", { className: "mt-4 min-h-8 px-4 py-2 bg-red-500 text-white rounded-lg transition-transform", onClick: closeModal, children: "Close" })] }) }))] }) }));
};
export default TheatreList;
