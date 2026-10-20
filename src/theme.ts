// Tokens visuais do Acolher — os mesmos do protótipo no Figma.
export const colors = {
  primary: "#2E6B5E",
  primaryDark: "#1F4F45",
  primarySoft: "#E3F0EC",
  accent: "#F28C5B",
  accentSoft: "#FDEBE1",
  warn: "#B7790A",
  warnText: "#6B4A05",
  warnSoft: "#FDF3DC",
  danger: "#C93C3C",
  dangerSoft: "#FBE4E4",
  info: "#3B6FB6",
  infoSoft: "#E4EDF8",
  purple: "#7A5AB8",
  purpleSoft: "#EEE8F8",
  background: "#F7F5F0",
  surface: "#FFFFFF",
  text: "#1F2A28",
  muted: "#6B7672",
  border: "#E4E0D8",
  onPrimaryMuted: "#CFE3DD",
};

export const fonts = {
  regular: "Nunito_400Regular",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  extrabold: "Nunito_800ExtraBold",
};

export const radius = { sm: 12, md: 14, lg: 18, xl: 28 };

/** Par de cores (forte + suave) usado em ícones, avatares e etiquetas. */
export type Tom = { cor: string; fundo: string };

export const tons = {
  verde: { cor: colors.primary, fundo: colors.primarySoft },
  coral: { cor: colors.accent, fundo: colors.accentSoft },
  azul: { cor: colors.info, fundo: colors.infoSoft },
  roxo: { cor: colors.purple, fundo: colors.purpleSoft },
  amarelo: { cor: colors.warn, fundo: colors.warnSoft },
  vermelho: { cor: colors.danger, fundo: colors.dangerSoft },
} satisfies Record<string, Tom>;
