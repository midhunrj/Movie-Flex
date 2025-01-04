import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { UserRoute } from "./routes/userRoute";
import { TheatreRoute } from "./routes/theatreRoute";
import { AdminRoute } from "./routes/adminRoute";
import { DndProvider } from "react-dnd";
import { Toaster } from 'sonner';
import { HTML5Backend } from "react-dnd-html5-backend";
// import { ChakraProvider, extendTheme } from '@chakra-ui/react'
// Optional: Customize the theme if needed
// const customTheme = extendTheme({
//   colors: {
//     primary: {
//       500: "#3182CE", // Example custom primary color
//     },
//   },
// });
function App() {
    return (_jsxs("div", { className: "App", children: [_jsx(Toaster, {}), _jsx(DndProvider, { backend: HTML5Backend, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/*", element: _jsx(UserRoute, {}) }), _jsx(Route, { path: "/theatre/*", element: _jsx(TheatreRoute, {}) }), _jsx(Route, { path: "/admin/*", element: _jsx(AdminRoute, {}) })] }) })] }));
}
export default App;
