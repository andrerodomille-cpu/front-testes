import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StorageUtils } from "@/utils/storageUtils";

interface RetrieveParams {
    id: number;
    id_empresa: number;
}

interface Loja {
    idconexao: number;
    loja: string;
}

interface ItemLoja {
    value: number;
    label: string;
}

interface EventChange {
    value: string | number | Date;
}

interface FiltroEngajamentoProps {
    onLojaChange?: (id: number) => void;
    onInicioChange?: (date: Date) => void;
    onFimChange?: (date: Date) => void;
}


function parseLocalStorageDateOrDefault(key: string): Date {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            const parsedValue = new Date(JSON.parse(storedValue));
            if (!isNaN(parsedValue.getTime())) {
                return parsedValue;
            }
        }
    } catch (error) {
        console.warn(
            `Erro ao fazer o parse do valor armazenado em "${key}":`,
            error
        );
    }
    return new Date();
}

const FiltroEngajamento: React.FC<FiltroEngajamentoProps> = ({ onLojaChange, onInicioChange, onFimChange }) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const [headerColor, setHeaderColor] = useState<string>("#fff");
    const listaLojas = [];
    const lblselecaodatainicial = t("comum.selecaodatainicial");
    const lblselecaodatafinal = t("comum.selecaodatafinal");
    const lblselecaoloja = t("comum.selecaoloja");
    const lblfiltros = t("comum.filtros");

    const salvarDataNoLocalStorage = (key: string, date: Date) => {
        localStorage.setItem(key, JSON.stringify(date.toISOString()));
    };


    const [tablelojas, setTableLojas] = useState([]);

    const [idConexao, setIdConexao] = useState<number | null>(() => {
        const storedValue = localStorage.getItem("idConexaoSmartCart");
        return storedValue ? JSON.parse(storedValue) : null;
    });
    const [dataInicial, setDataInicial] = React.useState<Date>(() =>
        parseLocalStorageDateOrDefault("carrinhoinicio")
    );
    const [dataFinal, setDataFinal] = React.useState<Date>(() =>
        parseLocalStorageDateOrDefault("carrinhofim")
    );

    const handleLojas = (id: string): void => {
        const idConexaoNumber = Number(id);
        setIdConexao(idConexaoNumber);
        localStorage.setItem("idConexaoSmartCart", JSON.stringify(idConexaoNumber));
        if (onLojaChange) {
            onLojaChange(idConexaoNumber);
        }
    };

    const handleInicio = (date: Date | undefined): void => {
        if (!date) return;

        setDataInicial(date);
        localStorage.setItem("carrinhoinicio", JSON.stringify(date));
        if (onInicioChange) {
            onInicioChange(date);
        }
    };

    const handleFim = (date: Date | undefined): void => {
        if (!date) return;

        setDataFinal(date);
        localStorage.setItem("carrinhofim", JSON.stringify(date));
        if (onFimChange) {
            onFimChange(date);
        }
    };

    function filtrarLojas(idUsuario: number): void {
        configService.listarLojasSmartCart(idUsuario).then((response) => {
            const listaLojas: ItemLoja[] = [];
            response.data.forEach((item: Loja) => {
                const itemLoja: ItemLoja = {
                    value: item.idconexao,
                    label: item.loja,
                };
                listaLojas.push(itemLoja);
            });

            setTableLojas(response.data);
        });
    }


    useEffect(() => {
        const savedColor = localStorage.getItem("headerColor");
        if (savedColor) {
            setHeaderColor(savedColor);
        }

        const retrieveParamsString = localStorage.getItem('user');

        if (retrieveParamsString) {
            const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
            filtrarLojas(retrieveParams.id);
        } else {
            console.error('Nenhum dado foi encontrado no localStorage.');
        }

    }, []);

    return (
        <Card className="w-full p-1 sm:p-2">
            <CardTitle style={{ color: headerColor, fontWeight: "bold" }} className="text-sm w-full">{lblfiltros}
            </CardTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-center">
                <div className="col-span-1 md:col-span-1 lg:col-span-1 p-1">
                    <Label
                        className="text-sm font-bold"
                        style={{ color: headerColor }}
                    >
                        {lblselecaodatainicial}
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full h-6 justify-start text-left text-sm"
                            >
                                {dataInicial ? format(dataInicial, "P", { locale }) : ""}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 text-sm">
                            <Calendar
                                className="text-sm"
                                mode="single"
                                selected={dataInicial}
                                onSelect={(day) => {
                                    if (day) {
                                        handleInicio(day);
                                        salvarDataNoLocalStorage("carrinhoinicio", day);
                                    }
                                }}
                                locale={locale}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-1">
                    <Label
                        className="text-sm font-bold"
                        style={{ color: headerColor }}
                    >
                        {lblselecaodatafinal}
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full h-6 justify-start text-left text-sm"
                            >
                                {dataFinal ? format(dataFinal, "P", { locale }) : ""}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dataFinal}
                                onSelect={(day) => {
                                    if (day) {
                                        handleFim(day);
                                        salvarDataNoLocalStorage("carrinhofim", day);
                                    }
                                }}
                                locale={locale}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                    <Label
                        htmlFor="select1"
                        className="text-sm font-bold"
                        style={{ color: headerColor }}
                    >
                        {lblselecaoloja}
                    </Label>
                    <Select value={idConexao?.toString() || ""} onValueChange={handleLojas}>
                        <SelectTrigger className="w-full h-6 text-sm">
                            <SelectValue placeholder={lblselecaoloja} />
                        </SelectTrigger>
                        <SelectContent className="w-full text-sm">
                            {tablelojas.map((opcao: Loja) => (
                                <SelectItem key={opcao.idconexao} value={opcao.idconexao.toString()}>
                                    {opcao.loja}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>

        </Card>
    );
};

export default FiltroEngajamento;