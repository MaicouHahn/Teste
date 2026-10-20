const DIA_MS = 24 * 60 * 60 * 1000;

const doisDigitos = (n: number) => String(n).padStart(2, "0");

/** 14:32 */
export function hora(d: Date) {
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

/** 19/10/2026 */
export function dataBR(d: Date) {
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** 19/10 */
export function diaMes(d: Date) {
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}`;
}

/** 03/2027 */
export function mesAno(d: Date) {
  return `${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** "19 out" */
export function diaMesCurto(d: Date) {
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]}`;
}

export function inicioDoDia(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function somarDias(d: Date, dias: number) {
  return new Date(inicioDoDia(d).getTime() + dias * DIA_MS);
}

export function somarMeses(d: Date, meses: number) {
  const r = inicioDoDia(d);
  r.setMonth(r.getMonth() + meses);
  return r;
}

/** Dias inteiros entre hoje e a data (negativo = já passou). */
export function diasAte(d: Date, agora = new Date()) {
  return Math.round((inicioDoDia(d).getTime() - inicioDoDia(agora).getTime()) / DIA_MS);
}

export function mesmoDia(a: Date, b: Date) {
  return inicioDoDia(a).getTime() === inicioDoDia(b).getTime();
}

/** Converte "DD/MM/AAAA" em Date; retorna null se for inválida. */
export function lerDataBR(texto: string): Date | null {
  const m = texto.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, aaaa] = m.map(Number);
  const d = new Date(aaaa, mm - 1, dd);
  return d.getDate() === dd && d.getMonth() === mm - 1 ? d : null;
}

/** Aplica a máscara DD/MM/AAAA enquanto a pessoa digita. */
export function mascaraData(texto: string) {
  const n = texto.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

export function saudacao(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/** Plantões de 12h: Dia (07h–19h) e Noite (19h–07h). */
export function plantaoAtual(d = new Date()) {
  const h = d.getHours();
  return h >= 7 && h < 19 ? "Plantão Dia · 07h–19h" : "Plantão Noite · 19h–07h";
}
