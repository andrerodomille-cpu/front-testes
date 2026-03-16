import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import {
  Separator
} from "@/components/ui/separator";
import {
  Progress
} from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "@/services/auth.service";
import {
  Eye,
  EyeOff,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  ShieldCheck,
  Loader2,
  Sparkles,
  KeyRound,
  ArrowRight
} from "lucide-react";

interface RegrasSenha {
  senha_qtde_minima_caracteres: number;
  senha_verifica_numero: number;
  senha_verifica_maiuscula: number;
  senha_verifica_minuscula: number;
  senha_caracter_especial: number;
  senha_caracter_repetido: number;
  senha_apenas_letras_numeros: number;
}

interface RetrieveParams {
  id: number;
  id_empresa: number;
}

interface PasswordRequirement {
  id: keyof RegrasSenha;
  label: string;
  test: (value: string, regras: RegrasSenha) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: "senha_qtde_minima_caracteres",
    label: "Mínimo de caracteres",
    test: (value, regras) => value.length >= regras.senha_qtde_minima_caracteres,
  },
  {
    id: "senha_verifica_numero",
    label: "Pelo menos um número",
    test: (value, regras) => !regras.senha_verifica_numero || /\d/.test(value),
  },
  {
    id: "senha_verifica_maiuscula",
    label: "Pelo menos uma letra maiúscula",
    test: (value, regras) => !regras.senha_verifica_maiuscula || /[A-Z]/.test(value),
  },
  {
    id: "senha_verifica_minuscula",
    label: "Pelo menos uma letra minúscula",
    test: (value, regras) => !regras.senha_verifica_minuscula || /[a-z]/.test(value),
  },
  {
    id: "senha_caracter_especial",
    label: "Pelo menos um caractere especial",
    test: (value, regras) => !regras.senha_caracter_especial || /[!@#$%^&*(),.?":{}|<>]/.test(value),
  },
  {
    id: "senha_caracter_repetido",
    label: "Sem caracteres repetidos consecutivos",
    test: (value, regras) => !regras.senha_caracter_repetido || !/(.)\1/.test(value),
  },
  {
    id: "senha_apenas_letras_numeros",
    label: "Não apenas números ou letras",
    test: (value, regras) => !regras.senha_apenas_letras_numeros ||
      (!/^\d+$/.test(value) && !/^[A-Za-z]+$/.test(value)),
  },
];

function gerarSchemaSenha(regras: RegrasSenha) {
  let schema = Yup.string();

  if (regras.senha_qtde_minima_caracteres > 0) {
    schema = schema.min(
      regras.senha_qtde_minima_caracteres,
      `A senha deve ter no mínimo ${regras.senha_qtde_minima_caracteres} caracteres`
    );
  }
  if (regras.senha_verifica_numero) {
    schema = schema.matches(/\d/, "A senha deve conter pelo menos um número");
  }
  if (regras.senha_verifica_maiuscula) {
    schema = schema.matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula");
  }
  if (regras.senha_verifica_minuscula) {
    schema = schema.matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula");
  }
  if (regras.senha_caracter_especial) {
    schema = schema.matches(/[!@#$%^&*(),.?":{}|<>]/, "A senha deve conter pelo menos um caractere especial");
  }
  if (regras.senha_caracter_repetido) {
    schema = schema.test("no-repeated-chars", "A senha não pode ter caracteres repetidos consecutivos", value => {
      if (!value) return true;
      return !/(.)\1/.test(value);
    });
  }
  if (regras.senha_apenas_letras_numeros) {
    schema = schema.test("not-only-letters-or-numbers",
      "A senha não pode conter apenas números ou apenas letras",
      value => {
        if (!value) return true;
        return !/^\d+$/.test(value) && !/^[A-Za-z]+$/.test(value);
      }
    );
  }

  return schema.required("A nova senha é obrigatória");
}

interface CriarSenhaFormValues {
  novaSenha: string;
  confirmarSenha: string;
}

const CriarSenha: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [validationSchema, setValidationSchema] = useState<Yup.ObjectSchema<any> | null>(null);
  const [regras, setRegras] = useState<RegrasSenha | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    async function carregarRegras() {
      try {
        const retrieveParamsString = localStorage.getItem("user");
        if (retrieveParamsString) {
          const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
          const response = await authService.regrasSenha(retrieveParams.id_empresa);
          const regrasData: RegrasSenha = response.data;

          setRegras(regrasData);

          const schema = Yup.object({
            novaSenha: gerarSchemaSenha(regrasData),
            confirmarSenha: Yup.string()
              .oneOf([Yup.ref("novaSenha")], "As senhas devem ser iguais")
              .required("A confirmação é obrigatória"),
          });

          setValidationSchema(schema);
        } else {
          console.error("Nenhum dado foi encontrado no localStorage.");
        }
      } catch (err) {
        console.error("Erro ao carregar regras de senha", err);
      }
    }
    carregarRegras();
  }, []);

  const calculatePasswordStrength = (password: string) => {
    if (!regras || !password) return 0;

    let strength = 0;
    const totalRequirements = passwordRequirements.filter(req => regras[req.id]).length;

    passwordRequirements.forEach(req => {
      if (regras[req.id] && req.test(password, regras)) {
        strength++;
      }
    });

    return totalRequirements > 0 ? Math.round((strength / totalRequirements) * 100) : 0;
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return "Fraca";
    if (strength < 70) return "Média";
    if (strength < 90) return "Boa";
    return "Excelente";
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthTextColor = (strength: number) => {
    if (strength < 30) return "text-red-600";
    if (strength < 70) return "text-yellow-600";
    return "text-green-600";
  };

  const handleSubmit = async (
    values: CriarSenhaFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError("");
    setSuccess(false);
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setError(t("login.erroaorecuperar"));
        return;
      }

      const user = JSON.parse(userString);
      await authService.alterarSenha(user.id, values.novaSenha);

      const updatedUser = { ...user, primeiro_acesso: 0 };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess(true);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) setError("Requisição inválida.");
        else if (err.response?.status === 401) setError("Senha atual incorreta.");
        else if (err.response?.status === 500) setError("Erro no servidor.");
        else setError("Erro ao alterar senha.");
      } else {
        setError("Erro inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOk = () => navigate("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-gray-200/50 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex flex-col items-center space-y-3">

            <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              {success
                ? ""
                : t("login.criarsenha")
              }

            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300 max-w-sm">
              {success
                ? ""
                : t("login.subcriarsenha")
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!success && validationSchema && regras && (
            <Formik<CriarSenhaFormValues>
              initialValues={{ novaSenha: "", confirmarSenha: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="space-y-5">
                    {/* Nova senha */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        {t("login.novasenha")}
                      </label>
                      <div className="relative group">
                        <Field
                          as={Input}
                          type={showNovaSenha ? "text" : "password"}
                          name="novaSenha"
                          placeholder="Digite sua nova senha"
                          className="rounded-b rounded-t bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 hover dark:bg-gray-800 w-full pl-10 pr-10 py-6 text-base transition-colors"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue("novaSenha", e.target.value);
                            setPasswordStrength(calculatePasswordStrength(e.target.value));
                          }}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowNovaSenha(!showNovaSenha)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {showNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      {/* Indicador de força da senha */}
                      {values.novaSenha && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Força da senha</span>
                            <span className="font-medium">{passwordStrength}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                              style={{ width: `${Math.min(passwordStrength, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Lista de requisitos */}
                      {regras && (
                        <div className="space-y-3 mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Requisitos de segurança:
                          </p>
                          <div className="grid gap-2">
                            {passwordRequirements.map((req) => {
                              if (!regras[req.id]) return null;
                              const isValid = values.novaSenha ? req.test(values.novaSenha, regras) : false;
                              const isActive = req.id === "senha_qtde_minima_caracteres"
                                ? regras.senha_qtde_minima_caracteres > 0
                                : regras[req.id];

                              if (!isActive) return null;

                              return (
                                <div key={req.id} className="flex items-center gap-3 text-sm">
                                  <div className={`p-1 rounded-full ${isValid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                    {isValid ? (
                                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                                    )}
                                  </div>
                                  <span className={isValid
                                    ? "text-green-700 dark:text-green-300 font-medium"
                                    : "text-gray-500 dark:text-gray-400"
                                  }>
                                    {req.label}
                                    {req.id === "senha_qtde_minima_caracteres" &&
                                      ` (${regras.senha_qtde_minima_caracteres}+)`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <ErrorMessage
                        name="novaSenha"
                        component="div"
                        className="text-sm text-red-600 flex items-center gap-2 mt-2"
                      >
                        {msg => (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{msg}</span>
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    <Separator />

                    {/* Confirmar senha */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        {t("login.confirmarsenha")}
                      </label>
                      <div className="relative group">
                        <Field
                          as={Input}
                          type={showConfirmarSenha ? "text" : "password"}
                          name="confirmarSenha"
                          placeholder="Confirme sua nova senha"
                          className="rounded-b rounded-t bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 hover dark:bg-gray-800 w-full pl-10 pr-10 py-6 text-base transition-colors"
                        />
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {showConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      {values.novaSenha && values.confirmarSenha && values.novaSenha === values.confirmarSenha && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Senhas coincidem!</span>
                        </div>
                      )}

                      <ErrorMessage
                        name="confirmarSenha"
                        component="div"
                        className="text-sm text-red-600 flex items-center gap-2 mt-2"
                      >
                        {msg => (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{msg}</span>
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-b rounded-t w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("login.aguarde")}
                      </>
                    ) : (
                      <>
                        {t("login.salvarsenha")}

                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {success && (
            <div className="space-y-8 text-center animate-in fade-in duration-300">
              <div className="flex justify-center">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 animate-in zoom-in duration-500">
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Senha Criada com Sucesso!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sua senha foi atualizada. Você será redirecionado para a página inicial.
                </p>
              </div>
              <Button
                onClick={handleOk}
                className="hover:bg-blue-900 rounded-b rounded-t bg-blue-800 w-full h-11 text-gray-100 font-medium"
              >
                Continuar
              </Button>
            </div>
          )}
        </CardContent>

        {!success && (
          <CardFooter className="pt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center w-full flex items-center justify-center gap-2">
              <ShieldCheck className="h-3 w-3" />
              <span>Utilize uma senha forte para proteger sua conta</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CriarSenha;