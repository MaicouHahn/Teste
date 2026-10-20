import { Component, type ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

/**
 * Se alguma tela quebrar, mostra o erro na tela em vez de ficar travado
 * na logo. Facilita descobrir o problema pelo celular.
 */
export class LimiteErro extends Component<{ children: ReactNode }, { erro: Error | null }> {
  state = { erro: null as Error | null };

  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }

  render() {
    const { erro } = this.state;
    if (!erro) return this.props.children;
    return (
      <View style={{ flex: 1, backgroundColor: "#FBE4E4", paddingTop: 60, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#C93C3C", marginBottom: 12 }}>
          O app encontrou um erro
        </Text>
        <ScrollView>
          <Text style={{ fontSize: 14, color: "#1F2A28" }}>{String(erro?.message ?? erro)}</Text>
          <Text style={{ fontSize: 12, color: "#6B7672", marginTop: 12 }}>{erro?.stack}</Text>
        </ScrollView>
      </View>
    );
  }
}
