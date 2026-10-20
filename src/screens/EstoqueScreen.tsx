import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Tela } from "../components/Tela";
import { Busca, Card, Chip, Divisor, Etiqueta, Fab, LinhaRolavel, Subtitulo, Titulo, Vazio } from "../components/ui";
import { useDados } from "../data/DadosContext";
import type { ItemEstoque } from "../data/tipos";
import type { TelaAbaProps } from "../navigation/tipos";
import { colors, fonts, tons, type Tom } from "../theme";
import { diaMes, diasAte, mesAno } from "../utils/datas";

const FILTROS = ["Todos", "Vencendo", "Em falta", "Alimentos", "Higiene", "Limpeza"] as const;
type Filtro = (typeof FILTROS)[number];

const DIAS_ALERTA = 7;

const vencendo = (i: ItemEstoque) => !!i.validade && diasAte(i.validade) <= DIAS_ALERTA;
const emFalta = (i: ItemEstoque) => i.quantidade <= i.minimo;

/** Etiqueta da direita: vencido, vence em X dias, estoque baixo ou OK. */
function situacao(i: ItemEstoque): { texto: string; tom: Tom } {
  if (i.validade) {
    const d = diasAte(i.validade);
    if (d < 0) return { texto: "Vencido", tom: tons.vermelho };
    if (d <= 2) return { texto: d === 0 ? "Hoje" : `${d} ${d === 1 ? "dia" : "dias"}`, tom: tons.vermelho };
    if (d <= DIAS_ALERTA) return { texto: `${d} dias`, tom: tons.amarelo };
  }
  if (emFalta(i)) return { texto: "Baixo", tom: tons.vermelho };
  return { texto: "OK", tom: tons.verde };
}

const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function EstoqueScreen({ route, navigation }: TelaAbaProps<"Estoque">) {
  const { estoque } = useDados();
  const [filtro, setFiltro] = useState<Filtro>(route.params?.filtro ?? "Todos");
  const [busca, setBusca] = useState("");

  // Quando a tela é aberta pelo alerta do Início, já vem filtrada.
  useEffect(() => {
    if (route.params?.filtro) setFiltro(route.params.filtro);
  }, [route.params?.filtro]);

  const lista = useMemo(() => {
    const termo = normalizar(busca);
    return estoque
      .filter((i) => {
        if (filtro === "Vencendo") return vencendo(i);
        if (filtro === "Em falta") return emFalta(i);
        if (filtro !== "Todos") return i.categoria === filtro;
        return true;
      })
      .filter((i) => normalizar(i.nome).includes(termo))
      .sort((a, b) => {
        // Mais urgentes primeiro
        const pa = vencendo(a) ? 0 : emFalta(a) ? 1 : 2;
        const pb = vencendo(b) ? 0 : emFalta(b) ? 1 : 2;
        if (pa !== pb) return pa - pb;
        return (a.validade?.getTime() ?? Infinity) - (b.validade?.getTime() ?? Infinity);
      });
  }, [estoque, filtro, busca]);

  const resumo: { n: number; rotulo: string; tom: Tom; filtro: Filtro }[] = [
    { n: estoque.filter(vencendo).length, rotulo: "vencendo", tom: tons.amarelo, filtro: "Vencendo" },
    { n: estoque.filter(emFalta).length, rotulo: "em falta", tom: tons.vermelho, filtro: "Em falta" },
    { n: estoque.length, rotulo: "itens", tom: tons.verde, filtro: "Todos" },
  ];

  return (
    <Tela flutuante={<Fab texto="Entrada" onPress={() => navigation.navigate("NovaEntrada")} />}>
      <View>
        <Titulo>Estoque</Titulo>
        <Subtitulo>Despensa da casa</Subtitulo>
      </View>

      <View style={styles.resumo}>
        {resumo.map((r) => (
          <Pressable
            key={r.rotulo}
            onPress={() => setFiltro(r.filtro)}
            style={[styles.resumoItem, { backgroundColor: r.tom.fundo }]}
            accessibilityRole="button"
          >
            <Text style={[styles.resumoNumero, { color: r.tom.cor }]}>{r.n}</Text>
            <Text style={[styles.resumoRotulo, { color: r.tom.cor }]}>{r.rotulo}</Text>
          </Pressable>
        ))}
      </View>

      <Busca valor={busca} onChange={setBusca} placeholder="Buscar item…" />

      <LinhaRolavel>
        {FILTROS.map((f) => (
          <Chip
            key={f}
            texto={f}
            ativo={filtro === f}
            corAtiva={f === "Vencendo" ? colors.warn : f === "Em falta" ? colors.danger : colors.primary}
            onPress={() => setFiltro(f)}
          />
        ))}
      </LinhaRolavel>

      <Card style={{ paddingVertical: 4, gap: 0 }}>
        {lista.length === 0 && <Vazio texto="Nenhum item neste filtro." />}
        {lista.map((i, indice) => {
          const s = situacao(i);
          const validade = i.validade
            ? `vence ${diasAte(i.validade) > 60 ? mesAno(i.validade) : diaMes(i.validade)}`
            : emFalta(i)
              ? `mínimo ${i.minimo}`
              : "sem validade";
          return (
            <View key={i.id}>
              {indice > 0 && <Divisor />}
              <View style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nome}>{i.nome}</Text>
                  <Text style={styles.sub}>
                    {i.quantidade} {i.unidade} · {validade}
                  </Text>
                </View>
                <Etiqueta texto={s.texto} tom={s.tom} />
              </View>
            </View>
          );
        })}
      </Card>
    </Tela>
  );
}

const styles = StyleSheet.create({
  resumo: { flexDirection: "row", gap: 10 },
  resumoItem: { flex: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  resumoNumero: { fontFamily: fonts.extrabold, fontSize: 24 },
  resumoRotulo: { fontFamily: fonts.bold, fontSize: 13 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  nome: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
});
