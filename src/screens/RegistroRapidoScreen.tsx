import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tela } from "../components/Tela";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { Avatar, Cabecalho, Chip, LinhaRolavel, TituloSecao } from "../components/ui";
import { useDados } from "../data/DadosContext";
import type { TipoRegistro } from "../data/tipos";
import { ORDEM_TIPOS, TIPOS_REGISTRO } from "../data/tiposRegistro";
import type { TelaRaizProps } from "../navigation/tipos";
import { colors, fonts, tons } from "../theme";
import { hora } from "../utils/datas";

const QUANTIDADES: Partial<Record<TipoRegistro, string[]>> = {
  mamadeira: ["90 ml", "120 ml", "150 ml", "180 ml", "210 ml"],
  medicacao: ["2,5 ml", "5 ml", "10 ml", "1 comp.", "20 gotas"],
};

/** Tipos em que dá para registrar sem escolher um acolhido (ex.: ronda geral). */
const ACOLHIDO_OPCIONAL: TipoRegistro[] = ["ronda", "ocorrencia"];

export function RegistroRapidoScreen({ route, navigation }: TelaRaizProps<"RegistroRapido">) {
  const { acolhidos, adicionarRegistro } = useDados();
  const [tipo, setTipo] = useState<TipoRegistro>(route.params?.tipo ?? "troca");
  const [acolhidoId, setAcolhidoId] = useState<string | undefined>(route.params?.acolhidoId);
  const [quantidade, setQuantidade] = useState<string | undefined>();
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [agora, setAgora] = useState(new Date());

  // Atualiza o horário mostrado no botão a cada 30 segundos.
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const opcoesQuantidade = QUANTIDADES[tipo];
  const acolhidoObrigatorio = !ACOLHIDO_OPCIONAL.includes(tipo);

  function escolherTipo(t: TipoRegistro) {
    setTipo(t);
    setQuantidade(undefined);
    setErro(null);
  }

  function registrar() {
    if (acolhidoObrigatorio && !acolhidoId) {
      setErro("Escolha para quem é o registro.");
      return;
    }
    if ((tipo === "ronda" || tipo === "ocorrencia") && !acolhidoId && !observacao.trim()) {
      setErro("Descreva a ronda ou a ocorrência na observação.");
      return;
    }
    adicionarRegistro({
      tipo,
      acolhidoId,
      quantidade,
      observacao: observacao.trim() || undefined,
    });
    navigation.navigate("Abas", { screen: "Plantao" });
  }

  return (
    <Tela>
      <Cabecalho titulo="Registro rápido" subtitulo="Toque no tipo, no acolhido e salve" />

      <TituloSecao>O que aconteceu?</TituloSecao>
      <View style={styles.grade}>
        {ORDEM_TIPOS.map((t) => {
          const info = TIPOS_REGISTRO[t];
          const ativo = tipo === t;
          return (
            <Pressable
              key={t}
              onPress={() => escolherTipo(t)}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
              style={[styles.tipo, ativo && { backgroundColor: info.tom.cor, borderColor: info.tom.cor }]}
            >
              <View style={[styles.tipoIcone, { backgroundColor: ativo ? "rgba(255,255,255,0.22)" : info.tom.fundo }]}>
                <MaterialCommunityIcons name={info.icone} size={22} color={ativo ? "#FFFFFF" : info.tom.cor} />
              </View>
              <Text style={[styles.tipoTexto, ativo && { color: "#FFFFFF" }]}>{info.rotulo}</Text>
            </Pressable>
          );
        })}
      </View>

      <TituloSecao>{acolhidoObrigatorio ? "Para quem?" : "Para quem? (opcional)"}</TituloSecao>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20, flexGrow: 0 }}
        contentContainerStyle={{ gap: 14, paddingHorizontal: 20 }}
      >
        {!acolhidoObrigatorio && (
          <Pressable style={styles.pessoa} onPress={() => setAcolhidoId(undefined)}>
            <Avatar iniciais="★" tom={tons.roxo} tamanho={54} selecionado={!acolhidoId} />
            <Text style={[styles.pessoaNome, !acolhidoId && styles.pessoaAtiva]}>Todos</Text>
          </Pressable>
        )}
        {acolhidos.map((a) => {
          const ativo = acolhidoId === a.id;
          return (
            <Pressable
              key={a.id}
              style={styles.pessoa}
              onPress={() => {
                setAcolhidoId(ativo ? undefined : a.id);
                setErro(null);
              }}
              accessibilityLabel={a.nome}
              accessibilityState={{ selected: ativo }}
            >
              <Avatar iniciais={a.iniciais} tom={{ cor: colors.text, fundo: colors.surface }} tamanho={54} selecionado={ativo} />
              <Text style={[styles.pessoaNome, ativo && styles.pessoaAtiva]} numberOfLines={1}>
                {a.nome.split(" ")[0]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {opcoesQuantidade && (
        <>
          <TituloSecao>{tipo === "mamadeira" ? "Quantidade" : "Dose"}</TituloSecao>
          <LinhaRolavel>
            {opcoesQuantidade.map((q) => (
              <Chip
                key={q}
                texto={q}
                ativo={quantidade === q}
                corAtiva={colors.accent}
                onPress={() => setQuantidade(quantidade === q ? undefined : q)}
              />
            ))}
          </LinhaRolavel>
        </>
      )}

      <TextField
        label={tipo === "ronda" || tipo === "ocorrencia" ? "Descrição" : "Observação (opcional)"}
        value={observacao}
        onChangeText={setObservacao}
        placeholder={tipo === "ronda" ? "Ex.: todos dormindo, Júlia acordada" : "Escreva se precisar"}
        multiline
      />

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <Button title={`Registrar agora · ${hora(agora)}`} icone="check" onPress={registrar} />
      <Text style={styles.nota}>Hora e educadora são preenchidas automaticamente.</Text>
    </Tela>
  );
}

const styles = StyleSheet.create({
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tipo: {
    width: "31.4%",
    height: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  tipoIcone: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tipoTexto: { fontFamily: fonts.extrabold, fontSize: 14, color: colors.text },
  pessoa: { alignItems: "center", gap: 6, width: 62 },
  pessoaNome: { fontFamily: fonts.semibold, fontSize: 12, color: colors.text },
  pessoaAtiva: { fontFamily: fonts.extrabold, color: colors.primary },
  erro: { fontFamily: fonts.bold, fontSize: 13, color: colors.danger },
  nota: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: "center" },
});
