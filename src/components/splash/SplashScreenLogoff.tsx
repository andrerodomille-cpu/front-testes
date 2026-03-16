import React from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslation } from "react-i18next";

const SplashScreenLogoff: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col h-screen transition-all ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      {/* 🔹 Cabeçalho com a Logo */}
      <header className={`w-full py-4 flex justify-left p-6 fixed top-0 shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        {/*
        <img
          src={
            theme === "dark"
              ? `${import.meta.env.BASE_URL}assets/cera_texto_branco.png`
              : `${import.meta.env.BASE_URL}assets/cera_texto_preto.png`
          }
          alt="Logo Cera"
          className="w-40 h-30"
        />
        
        */}
      </header>

      {/* 🔹 Corpo da Splash Screen */}
      <div className="bg-white dark:bg-gray-800 bg-opacity-90 flex-grow flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl font-bold">{t("splash.saindo")}</h1>
        <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
          {t("splash.subtituloLogoff")}
        </p>

        {/* 🔹 Spinner Animado */}
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 flex justify-center mt-1">
          <div className={`w-12 h-12 border-8 ${theme === "dark" ? "border-white" : "border-blue-500"} border-t-transparent rounded-full animate-spin`} />
        </div>
      </div>

      {/* 🔹 Rodapé */}
      <footer className={`text-sm text-center py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        © Copyright Cera Ingleza - {" "}
        <a className="text-blue-600 dark:text-blue-400 hover:underline">
          {t("splash.protegendo")}
        </a>
      </footer>
    </div>
  );
};

export default SplashScreenLogoff;
