import { useState } from "react";
import { Alert, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Tela } from "../components/Tela";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { CaixaIcone, Card, Chip, Divisor, Etiqueta, Subtitulo, Titulo, TituloSecao } from "../components/ui";
import { useDados } from "../data/DadosContext";
import type { Destino, Doacao, ItemDoado } from "../data/tipos";
import { colors, fonts, radius, tons } from "../theme";
import { dataBR, lerDataBR, mascaraData } from "../utils/datas";

const DESTINOS: Destino[] = ["Casa", "Bazar", "Brechó"];

function textoDoRecibo(d: Doacao) {
  const itens = d.itens.map((i) => `• ${i.quantidade} ${i.unidade} — ${i.descricao}`).join("\n");
  return (
    `RECIBO DE DOAÇÃO Nº ${String(d.numero).padStart(4, "0")}\n` +
    `Nossa Casa — Criciúma/SC\n\n` +
    `Recebemos de ${d.doador}, em ${dataBR(d.data)}, a doação de:\n${itens}\n\n` +
    `Destino: ${d.destino}\n\nObrigado por apoiar a Nossa Casa!`
  );
}

export function DoacoesScreen() {
  const { doacoes, emitirRecibo } = useDados();
  const [doador, setDoador] = useState("");
  const [data, setData] = useState(dataBR(new Date()));
  const [destino, setDestino] = useState<Destino>("Casa");
  const [itens, setItens] = useState<ItemDoado[]>([]);
  const [novoItem, setNovoItem] = useState("");
  const [novaQtd, setNovaQtd] = useState("1");
  const [ultimo, setUltimo] = useState<Doacao | null>(null);

  const ano = new Date().getFullYear();
  const doAno = doacoes.filter((d) => d.data.getFullYear() === ano);
  const totalItens = doAno.reduce((soma, d) => soma + d.itens.reduce((s, i) => s + i.quantidade, 0), 0);

  function adicionarItem() {
    if (!novoItem.trim()) return;
    setItens((atual) => [...atual, { descricao: novoItem.trim(), quantidade: Math.max(1, Number(novaQtd) || 1), unidade: "un" }]);
    setNovoItem("");
    setNovaQtd("1");
  }

  function emitir() {
    const dataDoacao = lerDataBR(data);
    if (!doador.trim()) return Alert.alert("Falta o doador", "Informe quem fez a doação.");
    if (itens.length === 0) return Alert.alert("Sem itens", "Adicione pelo menos um item doado.");
    if (!dataDoacao) return Alert.alert("Data inválida", "Use o formato DD/MM/AAAA.");

    const recibo = emitirRecibo({ doador: doador.trim(), data: dataDoacao, destino, itens });
    setUltimo(recibo);
    setDoador("");
    setItens([]);
    Alert.alert("Recibo emitido", `Recibo nº ${recibo.numero} para ${recibo.doador}.`);
  }

  async function compartilhar(d: Doacao) {
    await Share.share({ message: textoDoRecibo(d), title: `Recibo nº ${d.numero}` });
  }

  /** Relatório anual consolidado por item (para o Balanço Social). */
  function relatorioAnual() {
    const porItem = new Map<string, number>();
    for (const d of doAno) {
      for (const i of d.itens) porItem.set(i.descricao, (porItem.get(i.descricao) ?? 0) + i.quantidade);
    }
    const linhas = [...porItem.entries()].sort((a, b) => b[1] - a[1]).map(([item, qtd]) => `• ${item}: ${qtd}`);
    Share.share({
      title: `Doações ${ano}`,
      message: `Doações recebidas em ${ano} — Nossa Casa\n${doAno.length} recibos\n\n${linhas.join("\n")}`,
    });
  }

  return (
    <Tela>
      <View>
        <Titulo>Doações</Titulo>
        <Subtitulo>Recibos e prestação de contas</Subtitulo>
      </View>

      <Pressable onPress={relatorioAnual} style={styles.resumo} accessibilityRole="button">
        <CaixaIcone icone="bar-chart-2" tom={{ cor: "#FFFFFF", fundo: "#3E7F70" }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.resumoAno}>{ano} até agora</Text>
          <Text style={styles.resumoNumeros}>
            {doAno.length} recibos · {totalItens} itens
          </Text>
          <Text style={styles.resumoAcao}>Gerar relatório do Balanço Social</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#FFFFFF" />
      </Pressable>

      <TituloSecao>Novo recibo</TituloSecao>
      <TextField label="Doador" value={doador} onChangeText={setDoador} placeholder="Nome da pessoa ou empresa" />

      <Card style={{ gap: 10 }}>
        <View style={styles.linhaEntre}>
          <Text style={styles.cardTitulo}>Itens doados</Text>
          <Etiqueta texto={`${itens.length} ${itens.length === 1 ? "item" : "itens"}`} tom={tons.verde} />
        </View>
        {itens.map((i, indice) => (
          <View key={`${i.descricao}-${indice}`} style={styles.linhaItem}>
            <Text style={[styles.itemNome, { flex: 1 }]}>{i.descricao}</Text>
            <Text style={styles.itemQtd}>
              {i.quantidade} {i.unidade}
            </Text>
            <Pressable
              onPress={() => setItens((atual) => atual.filter((_, k) => k !== indice))}
              hitSlop={10}
              accessibilityLabel={`Remover ${i.descricao}`}
            >
              <Feather name="x" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ))}
        <View style={styles.novoItem}>
          <TextInput
            value={novoItem}
            onChangeText={setNovoItem}
            placeholder="Item (ex.: Cesta básica)"
            placeholderTextColor={colors.muted}
            style={[styles.input, { flex: 1 }]}
            onSubmitEditing={adicionarItem}
          />
          <TextInput
            value={novaQtd}
            onChangeText={(t) => setNovaQtd(t.replace(/\D/g, ""))}
            keyboardType="number-pad"
            style={[styles.input, { width: 56, textAlign: "center" }]}
            accessibilityLabel="Quantidade"
          />
        </View>
        <Pressable onPress={adicionarItem} style={styles.adicionar} hitSlop={6}>
          <Feather name="plus" size={18} color={colors.primary} />
          <Text style={styles.adicionarTexto}>Adicionar item</Text>
        </Pressable>
      </Card>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField
            label="Data"
            icon="calendar"
            value={data}
            onChangeText={(t) => setData(mascaraData(t))}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Text style={styles.rotulo}>Destino</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {DESTINOS.map((d) => (
            <Chip key={d} texto={d} ativo={destino === d} onPress={() => setDestino(d)} />
          ))}
        </View>
      </View>

      <Button title="Emitir recibo" icone="file-text" onPress={emitir} />
      {ultimo && (
        <Button title={`Compartilhar recibo nº ${ultimo.numero}`} icone="share" variante="secundario" onPress={() => compartilhar(ultimo)} />
      )}

      <TituloSecao>Recibos recentes</TituloSecao>
      <Card style={{ paddingVertical: 4, gap: 0 }}>
        {doacoes.slice(0, 5).map((d, i) => (
          <View key={d.id}>
            {i > 0 && <Divisor />}
            <Pressable style={styles.linhaRecibo} onPress={() => compartilhar(d)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemNome}>
                  Nº {d.numero} · {d.doador}
                </Text>
                <Text style={styles.itemQtd}>
                  {dataBR(d.data)} · {d.itens.length} {d.itens.length === 1 ? "item" : "itens"} · {d.destino}
                </Text>
              </View>
              <Feather name="share-2" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ))}
      </Card>
    </Tela>
  );
}

const styles = StyleSheet.create({
  resumo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  resumoAno: { fontFamily: fonts.bold, fontSize: 13, color: colors.onPrimaryMuted },
  resumoNumeros: { fontFamily: fonts.extrabold, fontSize: 16, color: "#FFFFFF" },
  resumoAcao: { fontFamily: fonts.bold, fontSize: 13, color: "#FFD7C2" },
  linhaEntre: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitulo: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.text },
  linhaItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemNome: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  itemQtd: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  novoItem: { flexDirection: "row", gap: 8 },
  input: {
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  adicionar: { flexDirection: "row", alignItems: "center", gap: 6 },
  adicionarTexto: { fontFamily: fonts.extrabold, fontSize: 14, color: colors.primary },
  rotulo: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  linhaRecibo: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
});
