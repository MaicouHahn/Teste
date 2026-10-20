import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";
import { tons, type Tom } from "../theme";
import type { TipoRegistro } from "./tipos";

type IconeMCI = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const TIPOS_REGISTRO: Record<TipoRegistro, { rotulo: string; icone: IconeMCI; tom: Tom }> = {
  troca: { rotulo: "Troca", icone: "autorenew", tom: tons.azul },
  banho: { rotulo: "Banho", icone: "water-outline", tom: tons.verde },
  mamadeira: { rotulo: "Mamadeira", icone: "baby-bottle-outline", tom: tons.coral },
  medicacao: { rotulo: "Medicação", icone: "pill", tom: tons.vermelho },
  ronda: { rotulo: "Ronda", icone: "weather-night", tom: tons.roxo },
  ocorrencia: { rotulo: "Ocorrência", icone: "alert-circle-outline", tom: tons.amarelo },
};

export const ORDEM_TIPOS: TipoRegistro[] = ["troca", "banho", "mamadeira", "medicacao", "ronda", "ocorrencia"];
