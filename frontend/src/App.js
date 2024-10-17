import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserRoute } from './routes/userRoute';
import { TheatreRoute } from './routes/theatreRoute';
import { AdminRoute } from './routes/adminRoute';
import 'react-toastify/dist/ReactToastify.css'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>

    <div className="App">
    <ToastContainer/>
    <DndProvider backend={HTML5Backend}>
      <Routes>
        
      {/* <Route path='/home' element={<Dashboard/>}/> */}
     <Route path='/*' element={<UserRoute/>}/>
     <Route path='/theatre/*' element={<TheatreRoute/>}/>
     <Route path='/admin/*' element={<AdminRoute/>}/>
     
     </Routes>
     </DndProvider>
     
     </div>
     </Router>
    
  );
}

export default App;
