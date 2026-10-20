// Componentes visuais reutilizados pelas telas (os mesmos do protótipo no Figma).
import type { ComponentProps, ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, fonts, radius, type Tom } from "../theme";

export type IconeFeather = ComponentProps<typeof Feather>["name"];
export type IconeMCI = ComponentProps<typeof MaterialCommunityIcons>["name"];

/* ---------- Textos ---------- */

export function Titulo({ children, tamanho = 26 }: { children: ReactNode; tamanho?: number }) {
  return <Text style={[s.titulo, { fontSize: tamanho }]}>{children}</Text>;
}

export function Subtitulo({ children }: { children: ReactNode }) {
  return <Text style={s.subtitulo}>{children}</Text>;
}

export function TituloSecao({ children, acao, onAcao }: { children: ReactNode; acao?: string; onAcao?: () => void }) {
  return (
    <View style={s.linhaEntre}>
      <Text style={s.tituloSecao}>{children}</Text>
      {acao && (
        <Pressable onPress={onAcao} hitSlop={8}>
          <Text style={s.link}>{acao}</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ---------- Containers ---------- */

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [s.card, style, pressed && s.pressionado]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[s.card, style]}>{children}</View>;
}

export function Divisor() {
  return <View style={s.divisor} />;
}

/** Linha horizontal rolável de chips/filtros. */
export function LinhaRolavel({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
      style={{ marginHorizontal: -20, flexGrow: 0 }}
    >
      {children}
    </ScrollView>
  );
}

/* ---------- Pequenos elementos ---------- */

export function Chip({
  texto,
  ativo,
  onPress,
  corAtiva = colors.primary,
}: {
  texto: string;
  ativo?: boolean;
  onPress?: () => void;
  corAtiva?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!ativo }}
      style={[s.chip, ativo ? { backgroundColor: corAtiva, borderColor: corAtiva } : null]}
    >
      <Text style={[s.chipTexto, ativo && s.chipTextoAtivo]}>{texto}</Text>
    </Pressable>
  );
}

export function Etiqueta({ texto, tom }: { texto: string; tom: Tom }) {
  return (
    <View style={[s.etiqueta, { backgroundColor: tom.fundo }]}>
      <Text style={[s.etiquetaTexto, { color: tom.cor }]}>{texto}</Text>
    </View>
  );
}

export function Avatar({
  iniciais,
  tom,
  tamanho = 44,
  selecionado,
}: {
  iniciais: string;
  tom: Tom;
  tamanho?: number;
  selecionado?: boolean;
}) {
  return (
    <View
      style={[
        s.centro,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          backgroundColor: selecionado ? colors.primary : tom.fundo,
          borderWidth: selecionado ? 3 : 0,
          borderColor: colors.primarySoft,
        },
      ]}
    >
      <Text style={{ fontFamily: fonts.extrabold, fontSize: tamanho * 0.36, color: selecionado ? "#FFFFFF" : tom.cor }}>
        {iniciais}
      </Text>
    </View>
  );
}

export function CaixaIcone({
  icone,
  mci,
  tom,
  tamanho = 40,
}: {
  icone?: IconeFeather;
  mci?: IconeMCI;
  tom: Tom;
  tamanho?: number;
}) {
  const t = Math.round(tamanho * 0.55);
  return (
    <View style={[s.centro, { width: tamanho, height: tamanho, borderRadius: 12, backgroundColor: tom.fundo }]}>
      {mci ? (
        <MaterialCommunityIcons name={mci} size={t} color={tom.cor} />
      ) : (
        <Feather name={icone ?? "circle"} size={t} color={tom.cor} />
      )}
    </View>
  );
}

/* ---------- Entrada de dados ---------- */

export function Busca({ valor, onChange, placeholder }: { valor: string; onChange: (t: string) => void; placeholder: string }) {
  return (
    <View style={s.busca}>
      <Feather name="search" size={20} color={colors.muted} />
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={s.buscaInput}
        autoCorrect={false}
        returnKeyType="search"
      />
      {valor.length > 0 && (
        <Pressable onPress={() => onChange("")} hitSlop={10} accessibilityLabel="Limpar busca">
          <Feather name="x" size={18} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}

/* ---------- Botões ---------- */

export function BotaoVoltar() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()} style={s.voltar} accessibilityLabel="Voltar" hitSlop={8}>
      <Feather name="chevron-left" size={22} color={colors.text} />
    </Pressable>
  );
}

export function Cabecalho({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <View style={s.cabecalho}>
      <BotaoVoltar />
      <View style={{ flex: 1 }}>
        <Text style={s.cabecalhoTitulo}>{titulo}</Text>
        {subtitulo && <Subtitulo>{subtitulo}</Subtitulo>}
      </View>
    </View>
  );
}

/** Botão flutuante coral ("+ Registrar"). */
export function Fab({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.fab, pressed && s.pressionado]} accessibilityRole="button">
      <Feather name="plus" size={20} color="#FFFFFF" />
      <Text style={s.fabTexto}>{texto}</Text>
    </Pressable>
  );
}

/** Estado vazio de listas. */
export function Vazio({ texto }: { texto: string }) {
  return (
    <View style={[s.centro, { paddingVertical: 40, gap: 8 }]}>
      <Feather name="inbox" size={28} color={colors.muted} />
      <Text style={s.subtitulo}>{texto}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  titulo: { fontFamily: fonts.extrabold, color: colors.text },
  subtitulo: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
  tituloSecao: { fontFamily: fonts.extrabold, fontSize: 17, color: colors.text },
  link: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  linhaEntre: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  centro: { alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  pressionado: { opacity: 0.75 },
  divisor: { height: 1, backgroundColor: colors.border },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipTexto: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  chipTextoAtivo: { fontFamily: fonts.bold, color: "#FFFFFF" },
  etiqueta: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, alignSelf: "flex-start" },
  etiquetaTexto: { fontFamily: fonts.bold, fontSize: 12 },
  busca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buscaInput: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  voltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cabecalho: { flexDirection: "row", alignItems: "center", gap: 12 },
  cabecalhoTitulo: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.text },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 18,
    paddingRight: 20,
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.accent,
    elevation: 6,
    shadowColor: "#99501A",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  fabTexto: { fontFamily: fonts.extrabold, fontSize: 15, color: "#FFFFFF" },
});
