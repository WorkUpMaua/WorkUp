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
import TelaPropriedades from './pages/TelaPropriedades'


createRoot(document.getElementById("root")!).render(
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/workspace/:id" element={<Workspace />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/rent" element={<TelaAluguel />} />
        <Route path="/signup" element={<Cadastro />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-property" element={<CreatePropriedades />} />
        <Route path="/properties" element={<TelaPropriedades />}/>
      </Routes>
    </Router>
);
