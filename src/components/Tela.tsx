import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "../theme";

/**
 * Estrutura padrão das telas: área segura no topo, conteúdo rolável com
 * margens de 20px e espaço extra no fim para não ficar atrás do botão flutuante.
 * `flutuante` recebe elementos fixos sobre o conteúdo (ex.: <Fab />).
 */
export function Tela({
  children,
  flutuante,
  rolavel = true,
}: {
  children: ReactNode;
  flutuante?: ReactNode;
  rolavel?: boolean;
}) {
  return (
    <SafeAreaView style={styles.tela} edges={["top"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {rolavel ? (
          <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.conteudo, { flex: 1 }]}>{children}</View>
        )}
      </KeyboardAvoidingView>
      {flutuante}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  conteudo: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 96, gap: 16 },
});
