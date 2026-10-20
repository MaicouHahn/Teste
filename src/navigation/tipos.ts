import type { NavigatorScreenParams } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { TipoRegistro } from "../data/tipos";

export type AbasParamList = {
  Inicio: undefined;
  Acolhidos: undefined;
  Plantao: undefined;
  Estoque: { filtro?: "Vencendo" | "Em falta" } | undefined;
  Doacoes: undefined;
};

export type RaizParamList = {
  Login: undefined;
  Abas: NavigatorScreenParams<AbasParamList>;
  Prontuario: { acolhidoId: string };
  RegistroRapido: { acolhidoId?: string; tipo?: TipoRegistro } | undefined;
  NovaEntrada: undefined;
};

export type TelaRaizProps<T extends keyof RaizParamList> = NativeStackScreenProps<RaizParamList, T>;

export type TelaAbaProps<T extends keyof AbasParamList> = CompositeScreenProps<
  BottomTabScreenProps<AbasParamList, T>,
  NativeStackScreenProps<RaizParamList>
>;
