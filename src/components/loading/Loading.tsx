import React, { useState, useEffect } from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large"; // Permite escolher tamanhos diferentes
  message?: string; // Mensagem opcional para exibir com o loading
  color?: string; // Cor opcional para o spinner
  className?: string; // Classe CSS adicional para estilização
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  message,
  color = "border-primary", // Cor padrão
  className = "",
}) => {
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
  };

  const [headerColor, setHeaderColor] = useState<string>("#fff");
  const [textColor, setTextColor] = useState<string>("#fff");

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor); 
      setTextColor(savedColor.replace(/bg-/g, "text-"));;
    }
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2 ${className}`}
      role="status"
      aria-label="Loading">
      
      <div className={`${textColor} animate-spin rounded-full border-t-2 ${sizeClasses[size]}`}></div>

      {message && (
        <p className={`text-sm text-center ${textColor}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;
