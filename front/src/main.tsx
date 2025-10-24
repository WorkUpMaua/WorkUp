import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cadastro from './pages/web/Cadastro'
import Workspace from './pages/web/Workspace'
import Login from './pages/web/Login'
import Home from "./pages/web/Home";
import UserProfile from "./pages/web/UserProfile";
import CreatePropriedades from './pages/web/CreatePropriedades'
import 'flatpickr/dist/themes/material_blue.css';
import './styles/index.css'
import TelaAluguel from './pages/web/TelaAluguel'
import TelaPropriedades from './pages/web/TelaPropriedades'


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
