import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Tela } from "../components/Tela";
import { Busca, CaixaIcone, Card, Chip, Fab, LinhaRolavel, Subtitulo, Titulo, Vazio } from "../components/ui";
import { useDados } from "../data/DadosContext";
import type { TipoRegistro } from "../data/tipos";
import { TIPOS_REGISTRO } from "../data/tiposRegistro";
import type { TelaAbaProps } from "../navigation/tipos";
import { colors, fonts } from "../theme";
import { diaMesCurto, hora, mesmoDia, plantaoAtual, somarDias } from "../utils/datas";

const FILTROS: { rotulo: string; tipo?: TipoRegistro }[] = [
  { rotulo: "Todos" },
  { rotulo: "Rondas", tipo: "ronda" },
  { rotulo: "Mamadeira", tipo: "mamadeira" },
  { rotulo: "Troca", tipo: "troca" },
  { rotulo: "Banho", tipo: "banho" },
  { rotulo: "Medicação", tipo: "medicacao" },
  { rotulo: "Ocorrências", tipo: "ocorrencia" },
];

const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function DiarioScreen({ navigation }: TelaAbaProps<"Plantao">) {
  const { registros, buscarAcolhido } = useDados();
  const [dia, setDia] = useState(new Date());
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState(0);

  const ehHoje = mesmoDia(dia, new Date());

  const lista = useMemo(() => {
    const tipo = FILTROS[filtro].tipo;
    const termo = normalizar(busca);
    return registros
      .filter((r) => mesmoDia(r.quando, dia))
      .filter((r) => !tipo || r.tipo === tipo)
      .filter((r) => {
        if (!termo) return true;
        const texto = [
          TIPOS_REGISTRO[r.tipo].rotulo,
          buscarAcolhido(r.acolhidoId)?.nome ?? "",
          r.autora,
          r.observacao ?? "",
        ].join(" ");
        return normalizar(texto).includes(termo);
      })
      .sort((a, b) => a.quando.getTime() - b.quando.getTime());
  }, [registros, dia, filtro, busca, buscarAcolhido]);

  return (
    <Tela flutuante={<Fab texto="Registrar" onPress={() => navigation.navigate("RegistroRapido")} />}>
      <View style={styles.topo}>
        <View style={{ flex: 1 }}>
          <Titulo tamanho={24}>Diário do plantão</Titulo>
          <Subtitulo>{ehHoje ? plantaoAtual() : "Registros do dia"}</Subtitulo>
        </View>
        <View style={styles.seletorDia}>
          <Pressable onPress={() => setDia(somarDias(dia, -1))} hitSlop={8} accessibilityLabel="Dia anterior">
            <Feather name="chevron-left" size={18} color={colors.primary} />
          </Pressable>
          <Text style={styles.diaTexto}>{ehHoje ? "Hoje" : diaMesCurto(dia)}</Text>
          <Pressable
            onPress={() => !ehHoje && setDia(somarDias(dia, 1))}
            hitSlop={8}
            disabled={ehHoje}
            accessibilityLabel="Próximo dia"
          >
            <Feather name="chevron-right" size={18} color={ehHoje ? colors.border : colors.primary} />
          </Pressable>
        </View>
      </View>

      <Busca valor={busca} onChange={setBusca} placeholder="Buscar acolhido, tipo ou educadora…" />

      <LinhaRolavel>
        {FILTROS.map((f, i) => (
          <Chip key={f.rotulo} texto={f.rotulo} ativo={filtro === i} onPress={() => setFiltro(i)} />
        ))}
      </LinhaRolavel>

      <View style={{ gap: 10 }}>
        {lista.length === 0 && <Vazio texto="Nenhum registro para este dia." />}
        {lista.map((r) => {
          const t = TIPOS_REGISTRO[r.tipo];
          const acolhido = buscarAcolhido(r.acolhidoId);
          const titulo = [t.rotulo + (r.quantidade ? ` ${r.quantidade}` : ""), acolhido?.nome].filter(Boolean).join(" · ");
          return (
            <Card key={r.id} style={styles.item}>
              <CaixaIcone mci={t.icone} tom={t.tom} tamanho={36} />
              <View style={{ flex: 1, gap: 2 }}>
                <View style={styles.linhaEntre}>
                  <Text style={styles.itemTitulo} numberOfLines={1}>
                    {titulo}
                  </Text>
                  <Text style={styles.itemHora}>{hora(r.quando)}</Text>
                </View>
                {r.observacao && <Text style={styles.itemTexto}>{r.observacao}</Text>}
                <Text style={styles.itemAutora}>por {r.autora}</Text>
              </View>
            </Card>
          );
        })}
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: "row", alignItems: "center", gap: 12 },
  seletorDia: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diaTexto: { fontFamily: fonts.bold, fontSize: 13, color: colors.primary, minWidth: 44, textAlign: "center" },
  item: { flexDirection: "row", alignItems: "flex-start", padding: 12 },
  linhaEntre: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  itemTitulo: { fontFamily: fonts.extrabold, fontSize: 14, color: colors.text, flex: 1 },
  itemHora: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  itemTexto: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
  itemAutora: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});
