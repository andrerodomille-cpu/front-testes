import axios, { AxiosResponse } from "axios";
import authHeader from "./auth.header";
import Config from "../config/config";

const API_URL = Config.URL_SERVICE + "auth/";

class AuthService {

  login(username: string, password: string): Promise<any> {
    return axios
      .post(API_URL + "login", { "email":username, "password":password })
      .then((response: AxiosResponse<any>) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log(response.data);
        return response.data;
      });
  }
  logout(): void {
    const keysToRemove = [
      "periodoSmartCart",
      "periodoOcorrencia",
      "idConexaoSmartCart",
      "dataInicio",
      "dataFim",
      "dataInicioPeriodo",
      "dataFimPeriodo",
      "dataInicioCockpit",
      "dataFimCockpit",
      "dataInicioEnterprise",
      "dataFimEnterprise",
      "listaConexoesEnterprise",
      "lojaCockpit",
      "idempresaCockpit",
      "idlojaCockpit",
      "supervisorremotolojas",
      "tokenZion",
      "ocorrenciaslojas",
      "supervisorremotolojasURA",
      "allowedRoutes"
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("foto")) {
        localStorage.removeItem(key);
      }
    }

    sessionStorage.clear();
  }
  verificarToken() {
  const token = localStorage.getItem("tokenZion");

  console.log(token);

  if (!token) {
    return Promise.resolve(false);
  }

  return axios.post(
    API_URL + "verify-token",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  )
  .then((response) => {
    return response.data.valid;
  })
  .catch((error) => {
    if (error.response) {
      console.error(
        "Erro de resposta do servidor:",
        error.response.data.message
      );
    } else if (error.request) {
      console.error("Erro na requisição:", error.request);
    } else {
      console.error("Erro ao configurar requisição:", error.message);
    }

    return false;
  });
  }
  
}

export default new AuthService();
