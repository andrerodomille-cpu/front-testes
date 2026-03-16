import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { Trash2, XCircle } from "lucide-react";

interface AlertaModalExclusaoProps {
  abrir: boolean;
  onClose: () => void;
  titulo: string;
  mensagem: string;
  onConfirm: () => void;
}

const AlertaModalExclusao: React.FC<AlertaModalExclusaoProps> = ({
  abrir,
  onClose,
  titulo,
  mensagem,
  onConfirm,
}) => {
  const [headerColor, setHeaderColor] = useState<string>("#d32f2f");
  const { t } = useTranslation();

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }
  }, []);

  return (
    <AlertDialog open={abrir} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle
            style={{ color: headerColor }}
            className="text-xl font-semibold flex items-center space-x-2"
          >
           <span>{titulo}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            {mensagem}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-4">
          <AlertDialogAction
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            <XCircle className="mr-2" />
            {t("comum.cancelar")}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={onConfirm}
            style={{ backgroundColor: headerColor }}
            className="text-white px-4 py-2 rounded-md"
          >
            <Trash2 className="mr-2" />
            {t("comum.confirmar")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertaModalExclusao;
