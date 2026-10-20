import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { DadosProvider } from "./src/data/DadosContext";
import { Rotas } from "./src/navigation/Rotas";
import { LimiteErro } from "./src/components/LimiteErro";
import { colors } from "./src/theme";

/** Tempo máximo esperando a fonte. Depois disso o app abre com a fonte do sistema. */
const LIMITE_FONTE_MS = 4000;

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const [tempoEsgotado, setTempoEsgotado] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTempoEsgotado(true), LIMITE_FONTE_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (erroFontes) console.warn("Não foi possível carregar a fonte Nunito:", erroFontes);
  }, [erroFontes]);

  // Nunca fica preso: abre quando a fonte carrega, falha ou o tempo acaba.
  if (!fontesCarregadas && !erroFontes && !tempoEsgotado) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: colors.primary }}>
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>Carregando o Acolher…</Text>
      </View>
    );
  }

  return (
    <LimiteErro>
      <SafeAreaProvider>
        <DadosProvider>
          <Rotas />
        </DadosProvider>
      </SafeAreaProvider>
    </LimiteErro>
  );
}
