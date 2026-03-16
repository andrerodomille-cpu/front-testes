export default function NaoAutorizado() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.636-1.14 1.016-2.01L13.016 4.99c-.62-.87-1.412-.87-2.032 0L3.066 16.99c-.62.87-.038 2.01 1.016 2.01z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Acesso Negado
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Ops! Parece que você não tem permissão para acessar esta página.
          </p>
          <a
            href="/"
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            Voltar para o início
          </a>
        </div>
      </div>
    );
  }
  