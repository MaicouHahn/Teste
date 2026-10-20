import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, radius } from "../theme";
import type { IconeFeather } from "./ui";

interface Props {
  title: string;
  onPress: () => void;
  icone?: IconeFeather;
  variante?: "primario" | "secundario";
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ title, onPress, icone, variante = "primario", loading, disabled }: Props) {
  const inativo = disabled || loading;
  const primario = variante === "primario";
  const corTexto = primario ? "#FFFFFF" : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inativo }}
      style={({ pressed }) => [
        styles.botao,
        primario ? styles.primario : styles.secundario,
        (pressed || inativo) && styles.pressionado,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <>
          {icone && <Feather name={icone} size={20} color={corTexto} />}
          <Text style={[styles.texto, { color: corTexto }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primario: { backgroundColor: colors.primary },
  secundario: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  pressionado: { opacity: 0.6 },
  texto: { fontFamily: fonts.extrabold, fontSize: 16 },
});
