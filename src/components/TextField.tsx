import { useState, type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, radius } from "../theme";

type Props = ComponentProps<typeof TextInput> & {
  label: string;
  icon?: ComponentProps<typeof Feather>["name"];
  senha?: boolean;
};

export function TextField({ label, icon, senha, style, multiline, ...rest }: Props) {
  const [foco, setFoco] = useState(false);
  const [oculta, setOculta] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, multiline && styles.boxMultilinha, foco && styles.boxFoco]}>
        {icon && <Feather name={icon} size={20} color={colors.muted} />}
        <TextInput
          style={[styles.input, multiline && styles.inputMultilinha, style]}
          placeholderTextColor={colors.muted}
          secureTextEntry={senha && oculta}
          multiline={multiline}
          onFocus={() => setFoco(true)}
          onBlur={() => setFoco(false)}
          {...rest}
        />
        {senha && (
          <Pressable
            onPress={() => setOculta((v) => !v)}
            hitSlop={12}
            accessibilityLabel={oculta ? "Mostrar senha" : "Ocultar senha"}
          >
            <Feather name={oculta ? "eye" : "eye-off"} size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 54,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  boxMultilinha: { height: undefined, minHeight: 88, alignItems: "flex-start", paddingVertical: 12 },
  boxFoco: { borderColor: colors.primary, borderWidth: 2 },
  input: { flex: 1, fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  inputMultilinha: { textAlignVertical: "top", minHeight: 64 },
});
