import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/index.css'
import Catalog from './pages/Catalog.tsx'
import Workspace from './pages/Workspace.tsx'
import Login from './pages/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="login" element={<Login />} />
        <Route path="/workspace/:officeId" element={<Workspace />} />
      </Routes>
    </Router>
  </StrictMode>,
)
