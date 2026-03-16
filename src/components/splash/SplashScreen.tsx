import { useTranslation } from "react-i18next";

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();

  
  return (
    <div className="flex flex-col h-screen transition-all bg-white dark:bg-gray-800 text-black dark:text-white">
      {/* 🔹 Cabeçalho com a Logo */}
      <header className="w-full py-4 flex justify-left p-6 fixed top-0 shadow-md bg-white dark:bg-gray-800">
      </header>

      {/* 🔹 Corpo da Splash Screen */}
      <div className="bg-white dark:bg-gray-800 bg-opacity-90 flex-grow flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl font-bold">{t("splash.carregando")}</h1>
        <p className="mb-4 text-gray-500 dark:text-gray-300">
          {t("splash.subTitulo")}
        </p>

        {/* 🔹 Spinner Animado */}
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 flex justify-center mt-1">
          <div className="w-12 h-12 border-8 border-blue-500 dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>

    </div>
  );
};

export default SplashScreen;
