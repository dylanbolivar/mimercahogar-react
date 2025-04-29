// src/index.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 Agregado
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 Envolviendo App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
