import type { Tom } from "../theme";

export type Faixa = "bebe" | "crianca" | "adolescente";

export interface Medicacao {
  nome: string;
  posologia: string; // "5 ml · de 8 em 8h · até 22/10"
  proximoHorario: string; // "14:00"
}

export interface Acolhido {
  id: string;
  nome: string;
  iniciais: string;
  idade: string; // "2 anos", "8 meses"
  municipio: "Criciúma" | "Siderópolis" | "Nova Veneza";
  faixa: Faixa;
  tom: Tom;
  etiquetas: { texto: string; tom: Tom }[];
  acolhidoEm: Date;
  alergia?: string;
  medicacoes: Medicacao[];
  comportamento: string;
  escola?: string;
  documentos: string[];
}

export type TipoRegistro = "troca" | "banho" | "mamadeira" | "medicacao" | "ronda" | "ocorrencia";

export interface Registro {
  id: string;
  tipo: TipoRegistro;
  acolhidoId?: string; // ronda pode valer para todos
  quantidade?: string; // "180 ml"
  observacao?: string;
  quando: Date;
  autora: string;
}

export interface ItemEstoque {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  validade: Date | null;
  minimo: number;
  categoria: "Alimentos" | "Higiene" | "Limpeza" | "Outros";
}

export interface ItemDoado {
  descricao: string;
  quantidade: number;
  unidade: string;
}

export type Destino = "Casa" | "Bazar" | "Brechó";

export interface Doacao {
  id: string;
  numero: number;
  doador: string;
  data: Date;
  destino: Destino;
  itens: ItemDoado[];
}
