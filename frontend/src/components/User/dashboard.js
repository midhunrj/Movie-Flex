import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router';
const Dashboard = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Clear any authentication tokens or user data
        localStorage.removeItem('token'); // or however you manage your tokens
        navigate('/'); // Redirect to the login page
    };
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx("h1", { children: "Welcome to your Dashboard!" }), _jsx("p", { children: "Navigate through the options below:" }), _jsxs("ul", { children: [_jsx("li", { onClick: () => navigate('/profile'), children: "Profile" }), _jsx("li", { onClick: () => navigate('/settings'), children: "Settings" }), _jsx("li", { onClick: handleLogout, style: { color: 'red', cursor: 'pointer' }, children: "Logout" })] })] }));
};
export default Dashboard;
