import React from "react";
import DashboardOperadoresPDVIA from "@/components/dashboard-operadores-pdv-ia";
import { analiseOperadoresMock } from "@/mocks/analiseOperadoresMock";

function AnaliseOperadoresPage(): JSX.Element {
  return <DashboardOperadoresPDVIA data={analiseOperadoresMock} />;
}

export default AnaliseOperadoresPage;