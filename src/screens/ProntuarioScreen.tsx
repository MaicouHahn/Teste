import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tela } from "../components/Tela";
import {
  Avatar,
  Cabecalho,
  CaixaIcone,
  Card,
  Chip,
  Etiqueta,
  Fab,
  LinhaRolavel,
  TituloSecao,
  Vazio,
} from "../components/ui";
import { useDados } from "../data/DadosContext";
import { TIPOS_REGISTRO } from "../data/tiposRegistro";
import type { TelaRaizProps } from "../navigation/tipos";
import { colors, fonts, tons } from "../theme";
import { dataBR, hora, mesmoDia } from "../utils/datas";

const ABAS = ["Resumo", "Saúde", "Comportamento", "Escola"] as const;
type Aba = (typeof ABAS)[number];

export function ProntuarioScreen({ route, navigation }: TelaRaizProps<"Prontuario">) {
  const { buscarAcolhido, registros } = useDados();
  const [aba, setAba] = useState<Aba>("Resumo");
  const acolhido = buscarAcolhido(route.params.acolhidoId);

  if (!acolhido) {
    return (
      <Tela>
        <Cabecalho titulo="Prontuário" />
        <Vazio texto="Acolhido não encontrado." />
      </Tela>
    );
  }

  const hoje = registros
    .filter((r) => r.acolhidoId === acolhido.id && mesmoDia(r.quando, new Date()))
    .sort((a, b) => a.quando.getTime() - b.quando.getTime());

  const ocorrencias = registros.filter((r) => r.acolhidoId === acolhido.id && r.tipo === "ocorrencia");

  const medicacoes = (
    <Card>
      <View style={styles.linha}>
        <CaixaIcone mci="pill" tom={tons.coral} tamanho={32} />
        <Text style={styles.cardTitulo}>Medicações em uso</Text>
      </View>
      {acolhido.medicacoes.length === 0 && <Text style={styles.sub}>Nenhuma medicação em uso.</Text>}
      {acolhido.medicacoes.map((m) => (
        <View key={m.nome} style={styles.linhaEntre}>
          <View style={{ flex: 1 }}>
            <Text style={styles.forte}>{m.nome}</Text>
            <Text style={styles.sub}>{m.posologia}</Text>
          </View>
          <Etiqueta texto={`Próx. ${m.proximoHorario}`} tom={tons.coral} />
        </View>
      ))}
      {acolhido.alergia && (
        <View style={styles.alergia}>
          <Feather name="alert-triangle" size={16} color={colors.danger} />
          <Text style={styles.alergiaTexto}>Alergia: {acolhido.alergia}</Text>
        </View>
      )}
    </Card>
  );

  const rotinaHoje = (
    <Card>
      <TituloSecao acao="Ver diário" onAcao={() => navigation.navigate("Abas", { screen: "Plantao" })}>
        Hoje
      </TituloSecao>
      {hoje.length === 0 && <Text style={styles.sub}>Nenhum registro hoje.</Text>}
      {hoje.map((r) => {
        const t = TIPOS_REGISTRO[r.tipo];
        return (
          <View key={r.id} style={styles.linha}>
            <Text style={styles.hora}>{hora(r.quando)}</Text>
            <CaixaIcone mci={t.icone} tom={t.tom} tamanho={30} />
            <Text style={[styles.forte, { flex: 1 }]}>
              {t.rotulo}
              {r.quantidade ? ` ${r.quantidade}` : ""}
            </Text>
            <Text style={styles.sub}>por {r.autora}</Text>
          </View>
        );
      })}
    </Card>
  );

  const documentos = (
    <Card>
      <Text style={styles.cardTitulo}>Documentos e fotos</Text>
      <View style={styles.docs}>
        {acolhido.documentos.map((d) => (
          <Pressable
            key={d}
            style={styles.doc}
            onPress={() => Alert.alert(d, "A visualização de documentos chega com o servidor de arquivos.")}
          >
            <Feather name={d === "Portfólio" ? "camera" : "file"} size={20} color={colors.primary} />
            <Text style={styles.docTexto}>{d}</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );

  return (
    <Tela flutuante={<Fab texto="Registrar" onPress={() => navigation.navigate("RegistroRapido", { acolhidoId: acolhido.id })} />}>
      <Cabecalho titulo="Prontuário" />

      <View style={styles.linha}>
        <Avatar iniciais={acolhido.iniciais} tom={acolhido.tom} tamanho={64} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{acolhido.nome}</Text>
          <Text style={styles.sub}>
            {acolhido.idade} · {acolhido.municipio}
          </Text>
          <Text style={styles.sub}>Acolhido(a) em {dataBR(acolhido.acolhidoEm)}</Text>
        </View>
      </View>

      <LinhaRolavel>
        {ABAS.map((a) => (
          <Chip key={a} texto={a} ativo={aba === a} onPress={() => setAba(a)} />
        ))}
      </LinhaRolavel>

      {aba === "Resumo" && (
        <>
          {medicacoes}
          {rotinaHoje}
          {documentos}
        </>
      )}

      {aba === "Saúde" && medicacoes}

      {aba === "Comportamento" && (
        <>
          <Card>
            <Text style={styles.cardTitulo}>Observações</Text>
            <Text style={styles.texto}>{acolhido.comportamento}</Text>
          </Card>
          <Card>
            <Text style={styles.cardTitulo}>Ocorrências registradas</Text>
            {ocorrencias.length === 0 && <Text style={styles.sub}>Nenhuma ocorrência.</Text>}
            {ocorrencias.map((o) => (
              <View key={o.id} style={styles.linha}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.warn} />
                <Text style={[styles.texto, { flex: 1 }]}>
                  {dataBR(o.quando)} {hora(o.quando)} · {o.observacao ?? "Sem descrição"}
                </Text>
              </View>
            ))}
          </Card>
        </>
      )}

      {aba === "Escola" && (
        <Card>
          <Text style={styles.cardTitulo}>Vida escolar</Text>
          <Text style={styles.texto}>{acolhido.escola ?? "Ainda não matriculado(a) ou fora da idade escolar."}</Text>
        </Card>
      )}
    </Tela>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: "row", alignItems: "center", gap: 10 },
  linhaEntre: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  nome: { fontFamily: fonts.extrabold, fontSize: 22, color: colors.text },
  cardTitulo: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.text },
  forte: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  texto: { fontFamily: fonts.regular, fontSize: 15, color: colors.text, lineHeight: 21 },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  hora: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted, width: 42 },
  alergia: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerSoft,
    borderRadius: 10,
    padding: 10,
  },
  alergiaTexto: { fontFamily: fonts.bold, fontSize: 13, color: colors.danger, flex: 1 },
  docs: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  doc: {
    width: 76,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  docTexto: { fontFamily: fonts.bold, fontSize: 11, color: colors.text },
});
