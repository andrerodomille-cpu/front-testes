import { useTranslation } from "react-i18next";

interface LoadingPageProps {
  title: string;
  subtitle?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-[98vh] bg-gray-100 dark:bg-gray-800">
      <header className="w-full py-4 px-6 fixed top-0 shadow-md bg-white dark:bg-gray-800 z-10">
        {/* Conteúdo do header */}
      </header>

      {/* Conteúdo centralizado abaixo do header */}
      <main className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 bg-opacity-90">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mb-4 text-gray-500 dark:text-gray-300">{subtitle}</p>

        <div className="flex justify-center mt-4">
          <div className="w-16 h-16 border-8 border-blue-500 dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    </div>
  );
};

export default LoadingPage;
