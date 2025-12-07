import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Hangman from './Hangman.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Hangman />
  </StrictMode>,
)
