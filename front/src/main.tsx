import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import Catalog from './pages/Catalog.tsx'
import Cadastro from './pages/Cadastro.tsx'
import Workspace from './pages/Workspace.tsx'
import Login from './pages/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Cadastro />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="/workspace/:officeId" element={<Workspace />} />
      </Routes>
    </Router>
  </StrictMode>,
)
