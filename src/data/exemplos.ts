// Dados de exemplo (fictícios) para demonstrar as telas sem backend.
// Nomes e situações são inventados. Nas próximas sprints virão da API.
import { tons } from "../theme";
import { somarDias, somarMeses } from "../utils/datas";
import type { Acolhido, Doacao, ItemEstoque, Registro } from "./tipos";

const hoje = new Date();
const as = (h: number, m: number, diasAtras = 0) => {
  const d = somarDias(hoje, -diasAtras);
  d.setHours(h, m, 0, 0);
  return d;
};

export const acolhidosIniciais: Acolhido[] = [
  {
    id: "a1",
    nome: "Ana Clara S.",
    iniciais: "AC",
    idade: "2 anos",
    municipio: "Criciúma",
    faixa: "crianca",
    tom: tons.coral,
    etiquetas: [{ texto: "Medicação", tom: tons.coral }],
    acolhidoEm: new Date(2026, 2, 12),
    alergia: "Proteína do leite de vaca (APLV)",
    medicacoes: [
      { nome: "Amoxicilina 250mg/5ml", posologia: "5 ml · de 8 em 8h · até 22/10", proximoHorario: "14:00" },
    ],
    comportamento: "Adaptada à rotina, dorme bem após o almoço. Chora na troca de plantão.",
    documentos: ["Certidão", "Cartão SUS", "Vacinas", "Portfólio"],
  },
  {
    id: "a2",
    nome: "Pedro H.",
    iniciais: "PH",
    idade: "8 meses",
    municipio: "Criciúma",
    faixa: "bebe",
    tom: tons.azul,
    etiquetas: [{ texto: "Bebê", tom: tons.azul }],
    acolhidoEm: new Date(2026, 6, 3),
    medicacoes: [
      { nome: "Paracetamol gotas", posologia: "Se febre acima de 37,8 °C", proximoHorario: "16:00" },
    ],
    comportamento: "Mamadeira a cada 3h. Sono leve à noite.",
    documentos: ["Certidão", "Cartão SUS", "Vacinas"],
  },
  {
    id: "a3",
    nome: "Júlia M.",
    iniciais: "JM",
    idade: "9 anos",
    municipio: "Siderópolis",
    faixa: "crianca",
    tom: tons.roxo,
    etiquetas: [{ texto: "Escola", tom: tons.roxo }],
    acolhidoEm: new Date(2025, 10, 20),
    medicacoes: [],
    comportamento: "Acorda à noite com frequência. Gosta de desenhar.",
    escola: "4º ano · E.E.B. (turno matutino)",
    documentos: ["Certidão", "Cartão SUS", "Boletim"],
  },
  {
    id: "a4",
    nome: "Lucas",
    iniciais: "LU",
    idade: "7 anos",
    municipio: "Nova Veneza",
    faixa: "crianca",
    tom: tons.verde,
    etiquetas: [
      { texto: "Irmãos", tom: tons.verde },
      { texto: "Escola", tom: tons.roxo },
    ],
    acolhidoEm: new Date(2026, 4, 8),
    medicacoes: [],
    comportamento: "Muito ligado ao irmão Mateus.",
    escola: "2º ano · turno matutino",
    documentos: ["Certidão", "Cartão SUS"],
  },
  {
    id: "a5",
    nome: "Mateus",
    iniciais: "MA",
    idade: "10 anos",
    municipio: "Nova Veneza",
    faixa: "crianca",
    tom: tons.verde,
    etiquetas: [
      { texto: "Irmãos", tom: tons.verde },
      { texto: "Escola", tom: tons.roxo },
    ],
    acolhidoEm: new Date(2026, 4, 8),
    medicacoes: [],
    comportamento: "Ajuda com o irmão mais novo. Gosta de futebol.",
    escola: "5º ano · turno matutino",
    documentos: ["Certidão", "Cartão SUS"],
  },
  {
    id: "a6",
    nome: "Beatriz S.",
    iniciais: "BS",
    idade: "15 anos",
    municipio: "Criciúma",
    faixa: "adolescente",
    tom: tons.amarelo,
    etiquetas: [{ texto: "Escola", tom: tons.roxo }],
    acolhidoEm: new Date(2025, 7, 1),
    medicacoes: [],
    comportamento: "Responsável, participa do curso de informática às quintas.",
    escola: "1º ano do Ensino Médio · turno vespertino",
    documentos: ["Certidão", "RG", "Cartão SUS", "Boletim"],
  },
  {
    id: "a7",
    nome: "Sofia R.",
    iniciais: "SR",
    idade: "4 anos",
    municipio: "Criciúma",
    faixa: "crianca",
    tom: tons.coral,
    etiquetas: [],
    acolhidoEm: new Date(2026, 8, 15),
    medicacoes: [],
    comportamento: "Ainda em adaptação. Gosta de histórias antes de dormir.",
    documentos: ["Certidão"],
  },
];

export const registrosIniciais: Registro[] = [
  { id: "r1", tipo: "ronda", observacao: "Júlia acordada, levada ao banheiro. Demais dormindo.", quando: as(2, 30), autora: "Márcia" },
  { id: "r2", tipo: "ronda", observacao: "6 acolhidos prontos para a escola, café na sala.", quando: as(6, 0), autora: "Márcia" },
  { id: "r3", tipo: "troca", acolhidoId: "a1", quando: as(7, 10), autora: "Carla" },
  { id: "r4", tipo: "mamadeira", acolhidoId: "a2", quantidade: "180 ml", quando: as(7, 30), autora: "Carla" },
  { id: "r5", tipo: "banho", acolhidoId: "a1", quando: as(9, 0), autora: "Márcia" },
  { id: "r6", tipo: "ocorrencia", acolhidoId: "a4", observacao: "Febre 37,8 °C. Coordenação avisada.", quando: as(10, 15), autora: "Rose" },
  { id: "r7", tipo: "medicacao", acolhidoId: "a1", quantidade: "5 ml", observacao: "Amoxicilina", quando: as(22, 0, 1), autora: "Márcia" },
];

export const estoqueInicial: ItemEstoque[] = [
  { id: "e1", nome: "Iogurte natural", quantidade: 12, unidade: "un", validade: somarDias(hoje, 2), minimo: 6, categoria: "Alimentos" },
  { id: "e2", nome: "Leite em pó 800 g", quantidade: 4, unidade: "latas", validade: somarDias(hoje, 5), minimo: 3, categoria: "Alimentos" },
  { id: "e3", nome: "Pão de forma", quantidade: 3, unidade: "pct", validade: somarDias(hoje, 6), minimo: 2, categoria: "Alimentos" },
  { id: "e4", nome: "Fermento em pó", quantidade: 1, unidade: "un", validade: somarMeses(hoje, 8), minimo: 3, categoria: "Alimentos" },
  { id: "e5", nome: "Fralda tamanho M", quantidade: 2, unidade: "pct", validade: null, minimo: 5, categoria: "Higiene" },
  { id: "e6", nome: "Arroz 5 kg", quantidade: 9, unidade: "pct", validade: somarMeses(hoje, 5), minimo: 4, categoria: "Alimentos" },
  { id: "e7", nome: "Feijão 1 kg", quantidade: 14, unidade: "pct", validade: somarMeses(hoje, 7), minimo: 6, categoria: "Alimentos" },
  { id: "e8", nome: "Sabonete infantil", quantidade: 10, unidade: "un", validade: somarMeses(hoje, 18), minimo: 4, categoria: "Higiene" },
  { id: "e9", nome: "Detergente", quantidade: 8, unidade: "un", validade: null, minimo: 4, categoria: "Limpeza" },
];

export const doacoesIniciais: Doacao[] = [
  {
    id: "d1",
    numero: 1,
    doador: "Mercado Bom Preço",
    data: somarDias(hoje, -12),
    destino: "Casa",
    itens: [{ descricao: "Cesta básica", quantidade: 4, unidade: "un" }],
  },
  {
    id: "d2",
    numero: 2,
    doador: "Paróquia Santa Bárbara",
    data: somarDias(hoje, -5),
    destino: "Bazar",
    itens: [
      { descricao: "Roupas infantis", quantidade: 2, unidade: "sacos" },
      { descricao: "Calçados", quantidade: 6, unidade: "pares" },
    ],
  },
];
