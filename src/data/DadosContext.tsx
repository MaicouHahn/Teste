import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { acolhidosIniciais, doacoesIniciais, estoqueInicial, registrosIniciais } from "./exemplos";
import type { Acolhido, Doacao, ItemEstoque, Registro } from "./tipos";

// Estado do app guardado só na memória do celular (some ao fechar o app).
// Quando a API existir, estas funções passam a chamar o servidor.

interface Dados {
  educadora: string | null;
  entrar: (usuario: string) => void;
  sair: () => void;

  acolhidos: Acolhido[];
  buscarAcolhido: (id?: string) => Acolhido | undefined;

  registros: Registro[];
  adicionarRegistro: (r: Omit<Registro, "id" | "quando" | "autora">) => void;

  estoque: ItemEstoque[];
  registrarEntrada: (e: { nome: string; quantidade: number; validade: Date | null }) => void;

  doacoes: Doacao[];
  emitirRecibo: (d: Omit<Doacao, "id" | "numero">) => Doacao;
}

const DadosContext = createContext<Dados | undefined>(undefined);

let sequencia = 100;
const novoId = (prefixo: string) => `${prefixo}${++sequencia}`;

/** "carla.souza" → "Carla" */
function nomeDaEducadora(usuario: string) {
  const primeiro = usuario.trim().split(/[.\s_@-]/)[0] ?? usuario;
  return primeiro.charAt(0).toUpperCase() + primeiro.slice(1).toLowerCase();
}

export function DadosProvider({ children }: { children: ReactNode }) {
  const [educadora, setEducadora] = useState<string | null>(null);
  const [acolhidos] = useState(acolhidosIniciais);
  const [registros, setRegistros] = useState(registrosIniciais);
  const [estoque, setEstoque] = useState(estoqueInicial);
  const [doacoes, setDoacoes] = useState(doacoesIniciais);

  const valor = useMemo<Dados>(
    () => ({
      educadora,
      entrar: (usuario) => setEducadora(nomeDaEducadora(usuario)),
      sair: () => setEducadora(null),

      acolhidos,
      buscarAcolhido: (id) => acolhidos.find((a) => a.id === id),

      registros,
      adicionarRegistro: (r) =>
        setRegistros((atual) => [
          { ...r, id: novoId("r"), quando: new Date(), autora: educadora ?? "Equipe" },
          ...atual,
        ]),

      estoque,
      registrarEntrada: ({ nome, quantidade, validade }) =>
        setEstoque((atual) => {
          const existente = atual.find((i) => i.nome.toLowerCase() === nome.trim().toLowerCase());
          if (existente) {
            return atual.map((i) =>
              i.id === existente.id
                ? { ...i, quantidade: i.quantidade + quantidade, validade: validade ?? i.validade }
                : i,
            );
          }
          return [
            ...atual,
            { id: novoId("e"), nome: nome.trim(), quantidade, unidade: "un", validade, minimo: 0, categoria: "Outros" },
          ];
        }),

      doacoes,
      emitirRecibo: (d) => {
        const recibo: Doacao = {
          ...d,
          id: novoId("d"),
          numero: doacoes.reduce((max, x) => Math.max(max, x.numero), 0) + 1,
        };
        setDoacoes((atual) => [recibo, ...atual]);
        return recibo;
      },
    }),
    [educadora, acolhidos, registros, estoque, doacoes],
  );

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>;
}

export function useDados() {
  const ctx = useContext(DadosContext);
  if (!ctx) throw new Error("useDados deve ser usado dentro de <DadosProvider>");
  return ctx;
}
