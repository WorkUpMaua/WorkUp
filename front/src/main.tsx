import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/App.css'
import App from './App'

// Add Font Awesome
const fontAwesomeScript = document.createElement('script')
fontAwesomeScript.src = 'https://kit.fontawesome.com/your-kit-code.js'
fontAwesomeScript.crossOrigin = 'anonymous'
document.head.appendChild(fontAwesomeScript)

// Add Poppins font
const poppinsLink = document.createElement('link')
poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
poppinsLink.rel = 'stylesheet'
document.head.appendChild(poppinsLink)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
