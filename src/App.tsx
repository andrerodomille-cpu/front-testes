import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Login from "@/scenes/login/login";
import AppRouter from "./routes/AppRouter";
import SplashScreen from "@/components/splash/SplashScreen";
import SplashScreenLogoff from "@/components/splash/SplashScreenLogoff";
import { ToastContainer } from "react-toastify";
import { PermissionProvider } from './contexts/PermissionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles/apexcharts.css';

const queryClient = new QueryClient();

function App() {


  useEffect(() => {
  }, []);


  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <PermissionProvider>
            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <AppRouter />
          </PermissionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );

}

export default App;