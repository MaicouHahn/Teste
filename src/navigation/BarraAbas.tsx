import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, fonts } from "../theme";
import type { IconeFeather } from "../components/ui";
import type { AbasParamList } from "./tipos";

const ABAS: Record<keyof AbasParamList, { rotulo: string; icone: IconeFeather }> = {
  Inicio: { rotulo: "Início", icone: "home" },
  Acolhidos: { rotulo: "Acolhidos", icone: "users" },
  Plantao: { rotulo: "Plantão", icone: "clipboard" },
  Estoque: { rotulo: "Estoque", icone: "package" },
  Doacoes: { rotulo: "Doações", icone: "file-text" },
};

/** Barra inferior igual à do protótipo: ícone com "pílula" verde na aba ativa. */
export function BarraAbas({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.barra, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((rota, indice) => {
        const ativa = state.index === indice;
        const aba = ABAS[rota.name as keyof AbasParamList];
        const cor = ativa ? colors.primary : colors.muted;

        const aoTocar = () => {
          const evento = navigation.emit({ type: "tabPress", target: rota.key, canPreventDefault: true });
          if (!ativa && !evento.defaultPrevented) navigation.navigate(rota.name);
        };

        return (
          <Pressable
            key={rota.key}
            onPress={aoTocar}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            accessibilityLabel={aba.rotulo}
          >
            <View style={[styles.pilula, ativa && styles.pilulaAtiva]}>
              <Feather name={aba.icone} size={22} color={cor} />
            </View>
            <Text style={[styles.rotulo, { color: cor, fontFamily: ativa ? fonts.bold : fonts.semibold }]}>
              {aba.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  item: { flex: 1, alignItems: "center", gap: 4 },
  pilula: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 14 },
  pilulaAtiva: { backgroundColor: colors.primarySoft },
  rotulo: { fontSize: 11 },
});
