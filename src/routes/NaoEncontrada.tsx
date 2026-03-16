import { motion } from "framer-motion";

export default function NaoEncontrada() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center max-w-md w-full"
            >
                <div
                    className="text-yellow-500 dark:text-yellow-400 mb-4"
                    role="alert"
                    aria-label="Ícone de erro"
                >
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
                            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                        />
                    </svg>

                </div>
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
                    Página não encontrada
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Ops! Parece que esta página que você quer acessar não existe.
                </p>
                <a
                    href="/"
                    className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                >
                    Voltar para o início
                </a>
            </motion.div>
        </div>
    );
}
