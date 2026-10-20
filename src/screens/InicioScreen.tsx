import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tela } from "../components/Tela";
import { Card, CaixaIcone, Divisor, Subtitulo, Titulo, TituloSecao, type IconeFeather } from "../components/ui";
import { useDados } from "../data/DadosContext";
import { TIPOS_REGISTRO } from "../data/tiposRegistro";
import type { TelaAbaProps } from "../navigation/tipos";
import { colors, fonts, tons, type Tom } from "../theme";
import { diasAte, hora, plantaoAtual, saudacao } from "../utils/datas";

export function InicioScreen({ navigation }: TelaAbaProps<"Inicio">) {
  const { educadora, sair, estoque, acolhidos, registros } = useDados();

  const vencendo = estoque.filter((i) => i.validade && diasAte(i.validade) <= 7);
  const medicacoes = acolhidos
    .flatMap((a) => a.medicacoes.map((m) => ({ acolhido: a, ...m })))
    .sort((a, b) => a.proximoHorario.localeCompare(b.proximoHorario));
  const ultimos = registros.slice().sort((a, b) => b.quando.getTime() - a.quando.getTime()).slice(0, 3);

  const acoes: { titulo: string; sub: string; icone: IconeFeather; tom: Tom; ir: () => void }[] = [
    { titulo: "Registro rápido", sub: "Troca, banho, mamadeira", icone: "clipboard", tom: tons.verde, ir: () => navigation.navigate("RegistroRapido") },
    { titulo: "Acolhidos", sub: `${acolhidos.length} de 21 vagas`, icone: "users", tom: tons.azul, ir: () => navigation.navigate("Acolhidos") },
    { titulo: "Nova entrada", sub: "Estoque e validade", icone: "package", tom: tons.coral, ir: () => navigation.navigate("NovaEntrada") },
    { titulo: "Novo recibo", sub: "Doações recebidas", icone: "file-text", tom: tons.roxo, ir: () => navigation.navigate("Doacoes") },
  ];

  function confirmarSaida() {
    Alert.alert("Sair", "Deseja encerrar a sessão neste aparelho?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: sair },
    ]);
  }

  return (
    <Tela>
      <View style={styles.topo}>
        <View style={{ flex: 1 }}>
          <Titulo tamanho={24}>
            {saudacao()}, {educadora}
          </Titulo>
          <Subtitulo>{plantaoAtual()}</Subtitulo>
        </View>
        <Pressable onPress={confirmarSaida} style={styles.botaoRedondo} accessibilityLabel="Sair">
          <Feather name="log-out" size={20} color={colors.text} />
        </Pressable>
      </View>

      {vencendo.length > 0 && (
        <Pressable
          onPress={() => navigation.navigate("Estoque", { filtro: "Vencendo" })}
          style={({ pressed }) => [styles.alerta, pressed && { opacity: 0.8 }]}
          accessibilityRole="button"
        >
          <CaixaIcone icone="alert-triangle" tom={{ cor: colors.warn, fundo: "#FFFFFF" }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertaTitulo}>
              {vencendo.length} {vencendo.length === 1 ? "item vence" : "itens vencem"} em até 7 dias
            </Text>
            <Text style={styles.alertaTexto} numberOfLines={1}>
              {vencendo.map((i) => i.nome).join(", ")}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.warnText} />
        </Pressable>
      )}

      <TituloSecao>Ações rápidas</TituloSecao>
      <View style={styles.grade}>
        {acoes.map((a) => (
          <Card key={a.titulo} onPress={a.ir} style={styles.acao}>
            <CaixaIcone icone={a.icone} tom={a.tom} />
            <View>
              <Text style={styles.acaoTitulo}>{a.titulo}</Text>
              <Text style={styles.acaoSub}>{a.sub}</Text>
            </View>
          </Card>
        ))}
      </View>

      <TituloSecao acao="Ver acolhidos" onAcao={() => navigation.navigate("Acolhidos")}>
        Próximas medicações
      </TituloSecao>
      <Card style={{ paddingVertical: 4, gap: 0 }}>
        {medicacoes.map((m, i) => (
          <View key={`${m.acolhido.id}-${m.nome}`}>
            {i > 0 && <Divisor />}
            <Pressable
              style={styles.linhaMed}
              onPress={() => navigation.navigate("Prontuario", { acolhidoId: m.acolhido.id })}
            >
              <View style={styles.horario}>
                <Text style={styles.horarioTexto}>{m.proximoHorario}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.medNome}>{m.acolhido.nome}</Text>
                <Text style={styles.acaoSub}>{m.nome}</Text>
              </View>
              <MaterialCommunityIcons name="pill" size={20} color={colors.muted} />
            </Pressable>
          </View>
        ))}
      </Card>

      <TituloSecao acao="Ver diário" onAcao={() => navigation.navigate("Plantao")}>
        Últimos registros
      </TituloSecao>
      <Card style={{ gap: 10 }}>
        {ultimos.map((r) => {
          const t = TIPOS_REGISTRO[r.tipo];
          return (
            <View key={r.id} style={styles.linhaReg}>
              <Text style={styles.regHora}>{hora(r.quando)}</Text>
              <CaixaIcone mci={t.icone} tom={t.tom} tamanho={30} />
              <Text style={styles.medNome}>{t.rotulo}</Text>
              <Text style={[styles.acaoSub, { marginLeft: "auto" }]}>por {r.autora}</Text>
            </View>
          );
        })}
      </Card>
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: "row", alignItems: "center", gap: 12 },
  botaoRedondo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  alerta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.warnSoft,
  },
  alertaTitulo: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.warnText },
  alertaTexto: { fontFamily: fonts.regular, fontSize: 13, color: colors.warnText },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  acao: { width: "47.8%", padding: 14, gap: 10 },
  acaoTitulo: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.text },
  acaoSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  linhaMed: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  horario: { backgroundColor: colors.primarySoft, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6 },
  horarioTexto: { fontFamily: fonts.extrabold, fontSize: 14, color: colors.primary },
  medNome: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  linhaReg: { flexDirection: "row", alignItems: "center", gap: 10 },
  regHora: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted, width: 42 },
});
