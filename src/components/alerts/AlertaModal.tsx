import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import { CircleX } from 'lucide-react';

interface AvisoModalProps {
  abrir: boolean;
  onClose: () => void;
  legenda: string;
  titulo: string;
  mensagem: string | { [key: string]: string }; // Pode ser string ou um objeto com múltiplos erros
  onConfirm: () => void;
}

const AlertaModal: React.FC<AvisoModalProps> = ({
  abrir,
  onClose,
  legenda,
  titulo,
  mensagem,
  onConfirm,
}) => {
  const [headerColor, setHeaderColor] = useState<string>("#fff");
  const { t } = useTranslation();
  
  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }
  }, []);

  const messageArray = typeof mensagem === "string"
    ? [mensagem]
    : Object.values(mensagem); 

  return (
    <AlertDialog open={abrir} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle
            style={{ color: headerColor }}
            className="text-xl font-semibold flex items-center space-x-2"
          >
            <span>{legenda}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            {titulo}
          </AlertDialogDescription>
          <AlertDialogDescription className="w-full p-4 text-sm bg-gray-200 dark:bg-gray-900 rounded-lg">
            {messageArray.length > 1 ? (
              <ul className="list-none space-y-2">
                {messageArray.map((msg, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CircleX className="text-red-600 w-5 h-5" />
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center space-x-2">
                <CircleX className="text-red-600 w-5 h-5" />
                <span>{messageArray[0]}</span>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-4">
          <AlertDialogAction
            onClick={onConfirm}
            style={{ backgroundColor: headerColor }}
            className="text-white px-4 py-2 rounded-md"
          >
            <CheckIcon className="mr-2" />
            {t("comum.confirmar")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertaModal;
