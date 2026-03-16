import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  tamanho?: "small" | "medium" | "large";
  mensagem: string; 
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ tamanho = "medium", mensagem }) => {
  const sizeMap = {small: 24, medium: 36,large: 48};

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <AlertCircle size={sizeMap[tamanho]} color="red" />
      <p className="text-sm text-red-500 text-center">{mensagem}</p>
    </div>
  );
};

export default ErrorMessage;