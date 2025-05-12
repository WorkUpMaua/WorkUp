import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import Catalog from './pages/Catalog.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="catalog" element={<Catalog />} />
      </Routes>
    </Router>
  </StrictMode>,
)
