import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
import UserProfile from "./pages/UserProfile";
import 'flatpickr/dist/themes/material_blue.css';
// // Add Font Awesome
// const fontAwesomeScript = document.createElement('script')
// fontAwesomeScript.src = 'https://kit.fontawesome.com/your-kit-code.js'
// fontAwesomeScript.crossOrigin = 'anonymous'
// document.head.appendChild(fontAwesomeScript)

// // Add Poppins font
// const poppinsLink = document.createElement('link')
// poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
// poppinsLink.rel = 'stylesheet'
// document.head.appendChild(poppinsLink)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace/:id" element={<Workspace />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
    </Router>
  </StrictMode>
);
