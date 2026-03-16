import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  Loader2
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
    label: "Quantidade mínima de caracteres",
    test: (value, regras) => value.length >= regras.senha_qtde_minima_caracteres,
  },
  {
    id: "senha_verifica_numero",
    label: "Contém número",
    test: (value, regras) => !regras.senha_verifica_numero || /\d/.test(value),
  },
  {
    id: "senha_verifica_maiuscula",
    label: "Contém letra maiúscula",
    test: (value, regras) => !regras.senha_verifica_maiuscula || /[A-Z]/.test(value),
  },
  {
    id: "senha_verifica_minuscula",
    label: "Contém letra minúscula",
    test: (value, regras) => !regras.senha_verifica_minuscula || /[a-z]/.test(value),
  },
  {
    id: "senha_caracter_especial",
    label: "Contém caractere especial",
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

interface AlterarSenhaFormValues {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

const AlterarSenha: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [showNovaSenha, setShowNovaSenha] = React.useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = React.useState(false);
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
            senhaAtual: Yup.string().required("A senha atual é obrigatória"),
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

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (
    values: AlterarSenhaFormValues,
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

      const updatedUser = { ...user, alterar_senha_login: 0 };
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-gray-200 dark:border-gray-700">
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center justify-center">
            
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
             {success 
              ? ""
              : t("login.alterarsenha")
            }
          </CardTitle>
          <CardDescription className="text-center">
            {success 
              ? ""
              : t("login.definasenha")
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {!success && validationSchema && regras && (
            <Formik<AlterarSenhaFormValues>
              initialValues={{ senhaAtual: "", novaSenha: "", confirmarSenha: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-2">
                  <div className="space-y-2">
                    {/* Senha atual */}
                    <div className="space-y-2">
                      <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        {t("login.senhaalual")}
                      </label>
                      <Field
                        as={Input}
                        type="password"
                        name="senhaAtual"
                        placeholder="Digite sua senha atual"
                        className="rounded-b rounded-t w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-800"
                      />
                      <ErrorMessage
                        name="senhaAtual"
                        component="div"
                        className="text-sm text-red-600 flex items-center gap-1"
                      />
                    </div>

                    <Separator />

                    {/* Nova senha */}
                    <div className="space-y-2">
                      <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        {t("login.novasenha")}
                      </label>
                      <div className="relative">
                        <Field
                          as={Input}
                          type={showNovaSenha ? "text" : "password"}
                          name="novaSenha"
                          placeholder="Crie uma nova senha"
                          className="rounded-b rounded-t w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-800"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue("novaSenha", e.target.value);
                            setPasswordStrength(calculatePasswordStrength(e.target.value));
                          }}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowNovaSenha(!showNovaSenha)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Requisitos da senha:
                          </p>
                          <div className="grid gap-1.5">
                            {passwordRequirements.map((req) => {
                              if (!regras[req.id]) return null;
                              const isValid = values.novaSenha ? req.test(values.novaSenha, regras) : false;
                              return (
                                <div key={req.id} className="flex items-center gap-2 text-sm">
                                  {isValid ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                                  )}
                                  <span className={isValid ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
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
                        className="text-sm text-red-600 flex items-center gap-1"
                      />
                    </div>

                    {/* Confirmar senha */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("login.confirmarsenha")}
                      </label>
                      <div className="relative">
                        <Field
                          as={Input}
                          type={showConfirmarSenha ? "text" : "password"}
                          name="confirmarSenha"
                          placeholder="Confirme sua nova senha"
                          className="rounded-b rounded-t w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-800"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {values.novaSenha && values.confirmarSenha && values.novaSenha === values.confirmarSenha && (
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          As senhas coincidem
                        </div>
                      )}
                      <ErrorMessage
                        name="confirmarSenha"
                        component="div"
                        className="text-sm text-red-600 flex items-center gap-1"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="hover:bg-blue-900 rounded-b rounded-t bg-blue-800 w-full h-11 text-gray-100 font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("login.aguarde")}
                      </>
                    ) : (
                      t("login.salvarsenha")
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {success && (
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Senha alterada com sucesso!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
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
          <CardFooter className="pt-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center w-full">
              Certifique-se de escolher uma senha forte e única para proteger sua conta.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AlterarSenha;