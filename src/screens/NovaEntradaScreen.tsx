import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Tela } from "../components/Tela";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { Cabecalho, Chip, LinhaRolavel } from "../components/ui";
import { useDados } from "../data/DadosContext";
import type { TelaRaizProps } from "../navigation/tipos";
import { colors, fonts, radius } from "../theme";
import { dataBR, lerDataBR, mascaraData, somarMeses } from "../utils/datas";

const ATALHOS_VALIDADE = [
  { rotulo: "+1 mês", meses: 1 },
  { rotulo: "+3 meses", meses: 3 },
  { rotulo: "+6 meses", meses: 6 },
];

const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Entrada de estoque em 3 campos: item, quantidade e validade. */
export function NovaEntradaScreen({ navigation }: TelaRaizProps<"NovaEntrada">) {
  const { estoque, registrarEntrada, emitirRecibo } = useDados();
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [validade, setValidade] = useState("");
  const [semValidade, setSemValidade] = useState(false);
  const [doacao, setDoacao] = useState(false);
  const [doador, setDoador] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  // Sugestões com os nomes que já existem no estoque (evita "Fermento" e "fermento em pó" duplicados).
  const sugestoes = useMemo(() => {
    const termo = normalizar(nome.trim());
    if (!termo) return [];
    return estoque.filter((i) => normalizar(i.nome).includes(termo) && normalizar(i.nome) !== termo).slice(0, 4);
  }, [estoque, nome]);

  function salvar() {
    if (!nome.trim()) return setErro("Informe o item.");
    let dataValidade: Date | null = null;
    if (!semValidade) {
      dataValidade = lerDataBR(validade);
      if (!dataValidade) return setErro("Informe a validade (DD/MM/AAAA) ou marque “Sem validade”.");
    }

    registrarEntrada({ nome, quantidade, validade: dataValidade });
    if (doacao) {
      emitirRecibo({
        doador: doador.trim() || "Doador anônimo",
        data: new Date(),
        destino: "Casa",
        itens: [{ descricao: nome.trim(), quantidade, unidade: "un" }],
      });
    }
    Alert.alert("Entrada salva", `${quantidade} × ${nome.trim()}${doacao ? " · recibo gerado em Doações" : ""}`);
    navigation.goBack();
  }

  return (
    <Tela>
      <Cabecalho titulo="Nova entrada" subtitulo="3 campos e pronto" />

      <TextField
        label="Item"
        icon="search"
        value={nome}
        onChangeText={(t) => {
          setNome(t);
          setErro(null);
        }}
        placeholder="Ex.: Fermento em pó"
        autoFocus
      />
      {sugestoes.length > 0 && (
        <LinhaRolavel>
          {sugestoes.map((s) => (
            <Chip key={s.id} texto={s.nome} onPress={() => setNome(s.nome)} />
          ))}
        </LinhaRolavel>
      )}

      <View style={{ gap: 6 }}>
        <Text style={styles.rotulo}>Quantidade</Text>
        <View style={styles.contador}>
          <Pressable
            onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
            style={[styles.botaoContador, { backgroundColor: colors.primarySoft }]}
            accessibilityLabel="Diminuir"
          >
            <Feather name="minus" size={22} color={colors.primary} />
          </Pressable>
          <View style={{ alignItems: "center" }}>
            <TextInput
              value={String(quantidade)}
              onChangeText={(t) => setQuantidade(Math.max(1, Number(t.replace(/\D/g, "")) || 1))}
              keyboardType="number-pad"
              style={styles.quantidade}
              accessibilityLabel="Quantidade"
            />
            <Text style={styles.unidade}>unidades</Text>
          </View>
          <Pressable
            onPress={() => setQuantidade((q) => q + 1)}
            style={[styles.botaoContador, { backgroundColor: colors.primary }]}
            accessibilityLabel="Aumentar"
          >
            <Feather name="plus" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {!semValidade && (
        <TextField
          label="Validade"
          icon="calendar"
          value={validade}
          onChangeText={(t) => setValidade(mascaraData(t))}
          placeholder="DD/MM/AAAA"
          keyboardType="number-pad"
          maxLength={10}
        />
      )}
      <LinhaRolavel>
        {ATALHOS_VALIDADE.map((a) => (
          <Chip
            key={a.rotulo}
            texto={a.rotulo}
            onPress={() => {
              setSemValidade(false);
              setValidade(dataBR(somarMeses(new Date(), a.meses)));
            }}
          />
        ))}
        <Chip texto="Sem validade" ativo={semValidade} onPress={() => setSemValidade((v) => !v)} />
      </LinhaRolavel>

      <View style={styles.alternar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.alternarTitulo}>Veio de doação?</Text>
          <Text style={styles.unidade}>Gera o recibo automaticamente</Text>
        </View>
        <Switch
          value={doacao}
          onValueChange={setDoacao}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#FFFFFF"
        />
      </View>

      {doacao && (
        <TextField label="Doador (opcional)" value={doador} onChangeText={setDoador} placeholder="Nome de quem doou" />
      )}

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <Button title="Salvar entrada" icone="check" onPress={salvar} />
    </Tela>
  );
}

const styles = StyleSheet.create({
  rotulo: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  contador: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  botaoContador: { width: 52, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  quantidade: { fontFamily: fonts.extrabold, fontSize: 28, color: colors.text, textAlign: "center", minWidth: 80, padding: 0 },
  unidade: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  alternar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alternarTitulo: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  erro: { fontFamily: fonts.bold, fontSize: 13, color: colors.danger },
});
