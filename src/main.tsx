import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LocaleProvider } from "@/contexts/LocaleProvider"
import { BrowserRouter } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/apexcharts.css';
import { FullScreenProvider } from './contexts/FullScreenContext.tsx'

createRoot(document.getElementById('root')!).render(
  
  <LocaleProvider>
    <StrictMode>
      <FullScreenProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FullScreenProvider>
    </StrictMode>
  </LocaleProvider>
);
