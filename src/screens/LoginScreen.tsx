import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { colors, fonts, radius } from "../theme";
import { useDados } from "../data/DadosContext";

/**
 * Tela de login do Acolher.
 * Nesta versão a validação é apenas local (campos preenchidos) e qualquer
 * usuário entra. A autenticação com a API (usuário, senha e token) vem depois.
 */
export function LoginScreen() {
  const { entrar } = useDados();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  function handleEntrar() {
    if (!usuario.trim() || !senha) {
      setErro("Preencha usuário e senha.");
      return;
    }
    setErro(null);
    entrar(usuario);
  }

  function esqueciSenha() {
    Alert.alert("Esqueci minha senha", "Peça à coordenação para redefinir seu acesso.");
  }

  return (
    <SafeAreaView style={styles.tela} edges={["top"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.marca}>
            <Image source={require("../../assets/icon.png")} style={styles.logo} />
            <Text style={styles.nomeApp}>Acolher</Text>
            <Text style={styles.instituicao}>Nossa Casa · Criciúma/SC</Text>
          </View>

          <View style={styles.formulario}>
            <View style={{ gap: 4 }}>
              <Text style={styles.titulo}>Entrar</Text>
              <Text style={styles.subtitulo}>Use o acesso fornecido pela coordenação.</Text>
            </View>

            <TextField
              label="Usuário"
              icon="user"
              value={usuario}
              onChangeText={setUsuario}
              placeholder="seu.usuario"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <TextField
              label="Senha"
              icon="lock"
              senha
              value={senha}
              onChangeText={setSenha}
              placeholder="••••••••"
              returnKeyType="done"
              onSubmitEditing={handleEntrar}
            />

            {erro && (
              <View style={styles.erro} accessibilityLiveRegion="polite">
                <Feather name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            )}

            <Pressable hitSlop={8} onPress={esqueciSenha}>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </Pressable>

            <Button title="Entrar" onPress={handleEntrar} />

            <View style={styles.rodape}>
              <Feather name="lock" size={13} color={colors.muted} />
              <Text style={styles.rodapeTexto}>
                Acesso restrito à equipe · dados protegidos (LGPD/ECA)
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, justifyContent: "space-between" },
  marca: { alignItems: "center", gap: 10, paddingTop: 56, paddingBottom: 40 },
  logo: { width: 96, height: 96, borderRadius: 24 },
  nomeApp: { fontFamily: fonts.extrabold, fontSize: 34, color: "#FFFFFF" },
  instituicao: { fontFamily: fonts.semibold, fontSize: 15, color: colors.onPrimaryMuted },
  formulario: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 24,
    paddingBottom: 40,
    gap: 18,
  },
  titulo: { fontFamily: fonts.extrabold, fontSize: 26, color: colors.text },
  subtitulo: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
  erro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerSoft,
    padding: 10,
    borderRadius: 10,
  },
  erroTexto: { fontFamily: fonts.bold, fontSize: 13, color: colors.danger, flex: 1 },
  link: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  rodape: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  rodapeTexto: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});
