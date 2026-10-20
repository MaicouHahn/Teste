import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useDados } from "../data/DadosContext";
import { colors } from "../theme";
import { BarraAbas } from "./BarraAbas";
import type { AbasParamList, RaizParamList } from "./tipos";

import { LoginScreen } from "../screens/LoginScreen";
import { InicioScreen } from "../screens/InicioScreen";
import { AcolhidosScreen } from "../screens/AcolhidosScreen";
import { ProntuarioScreen } from "../screens/ProntuarioScreen";
import { RegistroRapidoScreen } from "../screens/RegistroRapidoScreen";
import { DiarioScreen } from "../screens/DiarioScreen";
import { EstoqueScreen } from "../screens/EstoqueScreen";
import { NovaEntradaScreen } from "../screens/NovaEntradaScreen";
import { DoacoesScreen } from "../screens/DoacoesScreen";

const Pilha = createNativeStackNavigator<RaizParamList>();
const Abas = createBottomTabNavigator<AbasParamList>();

const tema = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.primary },
};

function AbasPrincipais() {
  return (
    <Abas.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <BarraAbas {...props} />}>
      <Abas.Screen name="Inicio" component={InicioScreen} />
      <Abas.Screen name="Acolhidos" component={AcolhidosScreen} />
      <Abas.Screen name="Plantao" component={DiarioScreen} />
      <Abas.Screen name="Estoque" component={EstoqueScreen} />
      <Abas.Screen name="Doacoes" component={DoacoesScreen} />
    </Abas.Navigator>
  );
}

export function Rotas() {
  const { educadora } = useDados();

  return (
    <NavigationContainer theme={tema}>
      <Pilha.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        {educadora ? (
          <>
            <Pilha.Screen name="Abas" component={AbasPrincipais} />
            <Pilha.Screen name="Prontuario" component={ProntuarioScreen} />
            <Pilha.Screen name="RegistroRapido" component={RegistroRapidoScreen} />
            <Pilha.Screen name="NovaEntrada" component={NovaEntradaScreen} />
          </>
        ) : (
          <Pilha.Screen name="Login" component={LoginScreen} />
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
