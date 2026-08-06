import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Toaster} from "react-hot-toast"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode 
    position="top-right"
      toastOptions={{
        duration: 2500,

        style: {
          background: "#ede0d4",
          color: "#6f4518",
          border: "1px solid #d6ccc2",
        },
      }}
  >
    <Toaster/>
    <App />
  </StrictMode>,
)
