import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import SidebarMenu from './sidebarMenu';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/admin/adminThunk';
import { blockUser, unblockUser } from '../../redux/admin/adminThunk';
const UserList = () => {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const { admin, isLoading, isSuccess, userData } = useSelector((state) => state.admin);
    const handleBlockUnblock = (userId, isBlocked) => {
        if (isBlocked) {
            dispatch(unblockUser(userId)); // Dispatch unblock action
        }
        else {
            dispatch(blockUser(userId)); // Dispatch block action
        }
    };
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = Array.isArray(userData) ? userData.slice(indexOfFirstUser, indexOfLastUser) : [];
    // Handle pagination
    const handleNextPage = () => {
        if (currentPage < Math.ceil(userData?.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    // useEffect(()=>{
    //   if (!userData || !Array.isArray(userData)){
    //     dispatch(fetchUsers())
    //     // console.log(userData,"all userData");
    //     // setUsers(userData)
    //     }
    //     // dispatch(fetchUsers())
    // },[userData,dispatch])
    useEffect(() => {
        dispatch(fetchUsers());
    }, []);
    return (_jsx(_Fragment, { children: _jsx("div", { children: _jsxs(SidebarMenu, { children: [_jsx("h1", { className: 'text-blue-500 text-nowrap font-bold', children: "UserList" }), _jsxs("table", { className: "min-w-full  border-collapse  bg-white rounded-lg shadow-lg  mt-4", children: [_jsx("thead", { children: _jsxs("tr", { className: 'rounded-lg border-collapse border  bg-slate-100', children: [_jsx("th", { className: "  border-gray-300 p-4", children: "No" }), _jsx("th", { className: " border-gray-300  p-4", children: "Name" }), _jsx("th", { className: "  border-gray-300  p-4", children: "Email" }), _jsx("th", { className: " border-gray-300  p-4", children: "Mobile" }), _jsx("th", { className: " border-gray-300 p-4", children: "status" }), _jsx("th", { className: " border-gray-300  p-4", children: "Action" })] }) }), _jsx("tbody", { className: 'space-y-2', children: currentUsers?.length > 0 ? (currentUsers.map((user, index) => (_jsxs("tr", { className: 'rounded-lg border-spacing-1 border  border-gray-300  gap-2', children: [_jsx("td", { className: " border-gray-300 p-4 text-center", children: indexOfFirstUser + index + 1 }), _jsx("td", { className: " border-gray-300 p-4", children: user.name }), _jsx("td", { className: " border-gray-300 p-4", children: user.email }), _jsx("td", { className: " border-gray-300 p-4", children: user.mobile }), _jsx("td", { className: `  text-center border-gray-300 p-2 ${user.is_blocked ? 'text-red-500' : 'text-green-500'}`, children: user.is_blocked ? 'Blocked' : 'Active' }), _jsx("td", { className: " text-center border-gray-300 p-2 ", children: _jsx("button", { className: `px-4 py-2  h-fit min-h-8  ${user.is_blocked ? 'bg-green-500' : 'bg-red-500'} text-white rounded`, onClick: () => handleBlockUnblock(user._id, user.is_blocked), children: user.is_blocked ? 'Unblock' : 'Block' }) })] }, user._id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, children: "No users found" }) })) })] }), _jsxs("div", { className: "flex justify-center mt-4", children: [_jsx("button", { onClick: handlePreviousPage, disabled: currentPage === 1, className: "px-2 py-1 h-fit mx-2 min-h-8 bg-blue-500 text-white rounded  cursor-pointer hover:bg-blue-800", children: "Previous" }), _jsx("span", { className: "px-6 py-1 mx-2 min-h-8  bg-blue-700 rounded text-white", children: currentPage }), _jsx("button", { onClick: handleNextPage, disabled: currentPage >= Math.ceil(userData?.length / usersPerPage), className: "px-2 py-1 h-fit mx-2 min-h-8 bg-blue-500  text-white rounded cursor-pointer hover:bg-blue-800", children: "Next" })] })] }) }) }));
};
export default UserList;
