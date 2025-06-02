import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Workspace from './pages/Workspace'
import Login from './pages/Login'
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import CreatePropriedades from './pages/CreatePropriedades'
import 'flatpickr/dist/themes/material_blue.css';
import './styles/index.css'
import TelaAluguel from './pages/TelaAluguel'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/workspace/:id" element={<Workspace />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/catalog" element={<Home />} />
        <Route path="/create-propriedades" element={<CreatePropriedades />} />
        <Route path="/tela-aluguel" element={<TelaAluguel />} />
      </Routes>
    </Router>
  </StrictMode>
);
