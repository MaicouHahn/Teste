import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Tela } from "../components/Tela";
import { Avatar, Busca, Card, Chip, Etiqueta, LinhaRolavel, Subtitulo, Titulo, Vazio } from "../components/ui";
import { useDados } from "../data/DadosContext";
import type { Faixa } from "../data/tipos";
import type { TelaAbaProps } from "../navigation/tipos";
import { colors, fonts, tons } from "../theme";

const VAGAS = 21;
const FILTROS: { rotulo: string; faixa?: Faixa }[] = [
  { rotulo: "Todos" },
  { rotulo: "Bebês", faixa: "bebe" },
  { rotulo: "Crianças", faixa: "crianca" },
  { rotulo: "Adolescentes", faixa: "adolescente" },
];

/** Remove acentos e caixa para buscar "julia" e achar "Júlia". */
const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function AcolhidosScreen({ navigation }: TelaAbaProps<"Acolhidos">) {
  const { acolhidos } = useDados();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState(0);

  const lista = useMemo(() => {
    const faixa = FILTROS[filtro].faixa;
    return acolhidos.filter(
      (a) => (!faixa || a.faixa === faixa) && normalizar(a.nome).includes(normalizar(busca)),
    );
  }, [acolhidos, busca, filtro]);

  return (
    <Tela>
      <View style={styles.topo}>
        <View style={{ flex: 1 }}>
          <Titulo>Acolhidos</Titulo>
          <Subtitulo>
            {acolhidos.length} de {VAGAS} vagas ocupadas
          </Subtitulo>
        </View>
        {acolhidos.length >= VAGAS && <Etiqueta texto="Lotação máxima" tom={tons.vermelho} />}
      </View>

      <Busca valor={busca} onChange={setBusca} placeholder="Buscar por nome…" />

      <LinhaRolavel>
        {FILTROS.map((f, i) => (
          <Chip key={f.rotulo} texto={f.rotulo} ativo={filtro === i} onPress={() => setFiltro(i)} />
        ))}
      </LinhaRolavel>

      <View style={{ gap: 10 }}>
        {lista.length === 0 && <Vazio texto="Nenhum acolhido encontrado." />}
        {lista.map((a) => (
          <Card
            key={a.id}
            style={styles.item}
            onPress={() => navigation.navigate("Prontuario", { acolhidoId: a.id })}
          >
            <Avatar iniciais={a.iniciais} tom={a.tom} tamanho={48} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.nome}>{a.nome}</Text>
              <Text style={styles.sub}>
                {a.idade} · {a.municipio}
              </Text>
              {a.etiquetas.length > 0 && (
                <View style={styles.etiquetas}>
                  {a.etiquetas.map((e) => (
                    <Etiqueta key={e.texto} texto={e.texto} tom={e.tom} />
                  ))}
                </View>
              )}
            </View>
            <Feather name="chevron-right" size={20} color={colors.muted} />
          </Card>
        ))}
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: "row", alignItems: "center", gap: 12 },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 14 },
  nome: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  etiquetas: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
});
