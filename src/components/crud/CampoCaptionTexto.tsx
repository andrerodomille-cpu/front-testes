import React from "react";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

type EditableFieldProps = {
    valor: string | number;
    caption: string;
};

export const CampoCaptionTexto: React.FC<EditableFieldProps> = ({
    valor,
    caption,
}) => {

    return (
        <div className="mt-1 mr-1">
            {caption && <Label className="text-sm font-medium text-gray-400 dark:text-gray-400">{caption}: </Label>}
            <Label className="text-sm text-gray-600 dark:text-gray-300">{valor}</Label>
        </div>
    );
};