import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import UserProfile from './pages/UserProfile';
// Importe outros componentes/páginas conforme necessário

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace/:id" element={<Workspace />} />
        <Route path="/user-profile" element={<UserProfile />} />
        {/* Adicione outras rotas aqui, se necessário */}
      </Routes>
    </Router>
  );
}