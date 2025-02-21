import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserRoute } from "./routes/userRoute";
import { TheatreRoute } from "./routes/theatreRoute";
import { AdminRoute } from "./routes/adminRoute";
import { DndProvider } from "react-dnd";
import {Toaster} from 'sonner'
import { HTML5Backend } from "react-dnd-html5-backend";
import NotFound404 from "./routes/protected/404Page";

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
  return (
    <div className="App">
      {/* <ToastContainer /> */}
      <Toaster />
      <DndProvider backend={HTML5Backend}>
        {/* <ChakraProvider theme={customTheme}> */}
          <Routes>
            {/* <Route path='/home' element={<Dashboard/>}/> */}
            <Route path="/*" element={<UserRoute />} />
            <Route path="/theatre/*" element={<TheatreRoute />} />
            <Route path="/admin/*" element={<AdminRoute />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
          {/* </ChakraProvider> */}
      </DndProvider>
    </div>
  );
}

export default App;
