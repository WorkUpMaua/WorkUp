import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/index.css'
import Catalog from './pages/Catalog.tsx'
import Cadastro from './pages/Cadastro.tsx'
import Workspace from './pages/Workspace.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/cadastro" replace />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/workspace/:officeId" element={<Workspace />} />
      </Routes>
    </Router>
  </StrictMode>,
)
