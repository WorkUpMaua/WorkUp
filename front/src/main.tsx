import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import Catalog from './pages/Catalog.tsx'
import Workspace from './pages/Workspace.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="catalog" element={<Catalog />} />
        <Route path="workspace" element={<Workspace />} />
      </Routes>
    </Router>
  </StrictMode>,
)
