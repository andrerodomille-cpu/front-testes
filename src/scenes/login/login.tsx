import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthService from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslation } from "react-i18next";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("O Usuário é obrigatório"),
  password: Yup.string()
    .required("A Senha é obrigatória"),
});

const Login: React.FC = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [savedUser, setSavedUser] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });

  interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
  }

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError("");
    setIsLoading(true);

    try {
      const sucesso = await AuthService.login(values.email, values.password);
      if (sucesso) {
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          localStorage.setItem("tokenZion", user.token);

          if (values.rememberMe) {
            localStorage.setItem("rememberMe", JSON.stringify({ email: values.email, rememberMe: true }));
          } else {
            localStorage.removeItem("rememberMe");
          }

          localStorage.setItem("isLogOut", "false");
          
          // Animação de transição
          document.body.style.opacity = '0';
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          setError(t("login.erroaorecuperar"));
        }
      } else {
        setError(t("login.credenciasinvalidas"));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code == "ERR_NETWORK") {
          setError(t("login.servicosindisponiveis"));
        } else {
          const err = error as { response: { status: number } };
          switch (err.response.status) {
            case 400:
              setError(t("login.requisicaoinvalida"));
              break;
            case 401:
              setError(t("login.senhainvalida"));
              break;
            case 403:
              setError(t("login.acessonaoautorizado"));
              break;
            case 404:
              setError(t("login.usuarioinvalido"));
              break;
            case 500:
              setError(t("login.erroservidor"));
              break;
            default:
              setError(t("login.errorequisicao"));
          }
        }
      }
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }

      const storedUser = localStorage.getItem("rememberMe");
      if (storedUser) {
        const parsedUser: LoginFormValues = JSON.parse(storedUser);
        setSavedUser(parsedUser);
      }
      
      const valido = await AuthService.verificarToken();
      if (valido) {
        navigate("/");
      }
    };

    init();
  }, [navigate, i18n]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      
      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Container principal */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Card de login */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20 dark:border-gray-700/30 transform transition-all duration-300 hover:shadow-3xl">
          
          {/* Logo e cabeçalho */}
          <div className="text-center mb-8">
 
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t("login.bemvindo")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {t("login.subTitulo")}
            </p>
          </div>

          {/* Formulário */}
          <Formik<LoginFormValues>
            enableReinitialize
            initialValues={savedUser}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-6">
                
                {/* Campo Email/Usuário */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("login.email")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <Field
                      as={Input}
                      name="email"
                      placeholder={t("login.informeusuario")}
                      value={values.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("email", e.target.value)
                      }
                      className="pl-10 h-12 w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm font-medium px-1 animate-shake"
                  />
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("login.senha")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={values.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("password", e.target.value)
                      }
                      className="pl-10 h-12 w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm font-medium px-1 animate-shake"
                  />
                </div>

                {/* Lembrar-me e Esqueci senha */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setFieldValue("rememberMe", !values.rememberMe)}
                      className="flex items-center group"
                    >
                      <div className={`relative w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                        values.rememberMe
                          ? 'bg-blue-500 border-blue-500 group-hover:bg-blue-600'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-500'
                      }`}>
                        {values.rememberMe && (
                          <svg className="absolute inset-0 w-4 h-4 m-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {t("login.lembrarme")}
                      </span>
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                {/* Botão de Login */}
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="relative w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <span className={`absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000`}></span>
                  
                  {isSubmitting || isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("login.aguarde")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {t("login.entrar")}
                      <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Mensagem de erro */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl animate-slide-in">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">
                {error}
              </p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <p>©{new Date().getFullYear()} {t("comum.copyright")}</p>
            </div>
            <p className="mt-2 text-xs text-center text-gray-400 dark:text-gray-500">
              {t("comum.versao")} 2.0
            </p>
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;