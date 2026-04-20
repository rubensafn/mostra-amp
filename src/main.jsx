import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.jsx'

const PalestrasPage    = lazy(() => import('./pages/PalestrasPage.jsx'))
const ProgramacaoPage  = lazy(() => import('./pages/ProgramacaoPage.jsx'))
const BlogPage         = lazy(() => import('./pages/BlogPage.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/palestras"
          element={
            <Suspense fallback={null}>
              <PalestrasPage />
            </Suspense>
          }
        />
        <Route
          path="/programacao"
          element={
            <Suspense fallback={null}>
              <ProgramacaoPage />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={null}>
              <BlogPage />
            </Suspense>
          }
        />
      </Routes>
      <SpeedInsights />
    </HashRouter>
    <SpeedInsights />
  </StrictMode>,
)
