import Login from './pages/Login';
import Register from './pages/Register'
import ChatPage from './pages/ChatPage'
import UploadPage from "./pages/UploadPage";
import ProtectedRoute from './components/ProtectedRoute';

import { BrowserRouter, Routes, Route } from "react-router-dom";


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          
            <Route path='/chat' element={<ProtectedRoute><ChatPage/></ProtectedRoute>}/>
          
         
            <Route path='/upload' element={ <ProtectedRoute><UploadPage/></ProtectedRoute>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
