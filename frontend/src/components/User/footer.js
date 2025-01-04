import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaPhoneAlt, FaRedoAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
const Footer = () => {
    return (_jsx("footer", { className: "bg-blue-950 text-[#DCE4C9] py-8", children: _jsxs("div", { className: "mx-4 px-8", children: [_jsxs("div", { className: "flex justify-between flex-wrap", children: [_jsxs("div", { className: "w-full md:w-1/4 mb-6", children: [_jsx("h4", { className: "text-lg font-bold mb-4 text-white", children: "Movies in Cinema" }), _jsx("ul", { className: "space-y-2", children: ['Inception', 'Interstellar', 'Tenet', 'The Dark Knight'].map((movie, index) => (_jsx("li", { className: "hover:text-white transition-colors duration-200 cursor-pointer ", children: movie }, index))) })] }), _jsxs("div", { className: "w-full md:w-1/4 mb-6", children: [_jsx("h4", { className: "text-lg font-bold mb-4 ", children: "Movies by Language" }), _jsx("ul", { className: "space-y-2", children: ['English', 'Hindi', 'Spanish', 'French'].map((language, index) => (_jsx("li", { className: "hover:text-white transition-colors duration-200 cursor-pointer", children: language }, index))) })] }), _jsxs("div", { className: "w-full md:w-1/4 mb-6", children: [_jsx("h4", { className: "text-lg font-bold mb-4 ", children: "Movies by Genre" }), _jsx("ul", { className: "space-y-2", children: ['Action', 'Drama', 'Comedy', 'Thriller'].map((genre, index) => (_jsx("li", { className: "hover:text-white transition-colors duration-200 cursor-pointer", children: genre }, index))) })] }), _jsxs("div", { className: "w-full md:w-1/4 mb-6", children: [_jsx("h4", { className: "text-lg font-bold mb-4 ", children: "Movies in Location" }), _jsx("ul", { className: "space-y-2", children: ['New York', 'Los Angeles', 'Chicago', 'Houston'].map((location, index) => (_jsx("li", { className: "hover:text-white transition-colors duration-200 cursor-pointer", children: location }, index))) })] })] }), _jsx("hr", { className: "my-8 border-gray-700" }), _jsxs("div", { className: "flex justify-around bg-slate-900 flex-wrap mx-8", children: [_jsxs("div", { className: "flex items-center space-x-4 hover:text-white transition-colors duration-200", children: [_jsx(FaPhoneAlt, { className: "text-2xl min-h-8" }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-bold", children: "24/7 Customer Support" }), _jsx("p", { className: "text-sm", children: "Call us anytime for help" })] })] }), _jsxs("div", { className: "flex items-center space-x-4 hover:text-white transition-colors duration-200", children: [_jsx(FaRedoAlt, { className: "text-2xl min-h-8" }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-bold", children: "Resend Booking Confirmation" }), _jsx("p", { className: "text-sm", children: "Didn\u2019t receive your confirmation? Resend it!" })] })] }), _jsxs("div", { className: "flex items-center space-x-4 hover:text-white transition-colors duration-200", children: [_jsx(FaEnvelope, { className: "text-2xl min-h-8" }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-bold", children: "Subscribe to Newsletter" }), _jsx("p", { className: "text-sm", children: "Get the latest updates on movies and offers" })] })] })] }), _jsxs("div", { className: "mt-8 flex justify-center space-x-6", children: [_jsx("a", { href: "#", "aria-label": "Facebook", className: "text-2xl text-gray-400 hover:text-white transition-colors duration-200", children: _jsx(FaFacebook, {}) }), _jsx("a", { href: "#", "aria-label": "Twitter", className: "text-2xl text-gray-400 hover:text-white transition-colors duration-200", children: _jsx(FaTwitter, {}) }), _jsx("a", { href: "#", "aria-label": "Instagram", className: "text-2xl text-gray-400 hover:text-white transition-colors duration-200", children: _jsx(FaInstagram, {}) })] })] }) }));
};
export default Footer;
