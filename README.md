# Acolher

App mobile para a **Nossa Casa** (Criciúma/SC), casa de acolhimento institucional de crianças e adolescentes. O objetivo é substituir os cadernos de papel e os grupos de WhatsApp usados no plantão por um único aplicativo.

> ABP de **Desenvolvimento Mobile** · Engenharia de Software, 5ª fase · SATC 2026.2

Protótipo (Figma): https://www.figma.com/design/cE8d6YVtWiO9QyuOXTC2aR

## Estado atual

Todas as **9 telas do protótipo** estão implementadas e navegáveis. Os dados são **de exemplo e ficam só na memória do celular**: tudo volta ao estado inicial quando o app é fechado. Ainda **não há backend nem banco de dados**. O login aceita qualquer usuário e senha preenchidos, e o nome antes do ponto vira o nome da educadora (`carla.souza` → "Carla").

| # | Tela | O que dá para fazer |
|---|---|---|
| 1 | **Login** | Entrar com usuário e senha (validação local), mostrar ou ocultar a senha |
| 2 | **Início** | Saudação e plantão atual, alerta de itens vencendo, ações rápidas, próximas medicações, últimos registros, sair |
| 3 | **Acolhidos** | Lista com busca (ignora acentos) e filtros Bebês / Crianças / Adolescentes |
| 4 | **Prontuário** | Abas Resumo, Saúde, Comportamento e Escola; medicações, alergia, rotina do dia, documentos; botão "Registrar" |
| 5 | **Registro rápido** | Tipo (troca, banho, mamadeira, medicação, ronda, ocorrência), acolhido, quantidade, observação; hora e educadora automáticas |
| 6 | **Diário do plantão** | Linha do tempo do dia, navegação entre dias, busca por acolhido, tipo ou educadora, filtros por tipo |
| 7 | **Estoque** | Resumo (vencendo, em falta, itens), busca, filtros, etiquetas de validade e de estoque baixo |
| 8 | **Nova entrada** | Item com sugestões, quantidade (+/−), validade com atalhos, opção "veio de doação" que já gera o recibo |
| 9 | **Doações** | Novo recibo com vários itens, compartilhar o recibo, recibos recentes, relatório anual para o Balanço Social |

## Estrutura

```
acolher/
├── App.tsx                     # carrega a fonte, os dados e a navegação
├── index.ts                    # ponto de entrada do Expo
├── app.json                    # nome, ícone e splash do app
├── assets/                     # ícone, ícone adaptativo (Android), splash e favicon
└── src/
    ├── screens/                # as 9 telas
    ├── components/
    │   ├── ui.tsx              # Card, Chip, Etiqueta, Avatar, Busca, Fab, Cabeçalho…
    │   ├── Tela.tsx            # estrutura padrão das telas (área segura + rolagem)
    │   ├── TextField.tsx       # campo com rótulo e ícone
    │   └── Button.tsx          # botão principal e secundário
    ├── navigation/
    │   ├── Rotas.tsx           # pilha (login, prontuário, registro, entrada) + abas
    │   ├── BarraAbas.tsx       # barra inferior igual à do protótipo
    │   └── tipos.ts            # tipos das rotas
    ├── data/
    │   ├── DadosContext.tsx    # estado do app em memória (registros, estoque, doações)
    │   ├── exemplos.ts         # dados fictícios de exemplo
    │   ├── tipos.ts            # modelos: Acolhido, Registro, ItemEstoque, Doacao
    │   └── tiposRegistro.ts    # ícone, cor e nome de cada tipo de registro
    ├── utils/datas.ts          # formatação e cálculo de datas
    └── theme.ts                # cores e fontes (as mesmas do protótipo)
```

## Pré-requisitos

- **Node.js 20 ou mais recente** (https://nodejs.org). Para conferir, rode `node -v`.
- No celular, o app **Expo Go** (Play Store ou App Store).

## Jeito mais fácil (Windows)

Dê **dois cliques em `rodar-no-celular.bat`**. O script:

1. apaga instalações antigas e instala as dependências do **SDK 57**, a versão que o Expo Go atual aceita;
2. ajusta as versões das bibliotecas com `npx expo install --fix`;
3. libera a porta 8081 no Firewall, se tiver permissão;
4. inicia em **modo túnel**, que funciona mesmo com Firewall ou redes diferentes.

Depois é só ler o QR code com o Expo Go, que deve estar atualizado. A primeira abertura leva cerca de 1 minuto.

**Plano B: instalar o app sem Expo Go.** Gere um APK na nuvem do Expo e instale direto no Android. É preciso criar uma conta gratuita em expo.dev.

```bash
npx eas-cli login
npx eas-cli build -p android --profile preview
```

No fim, o terminal mostra um link e um QR code para baixar o `.apk`. A compilação leva de 10 a 20 minutos.

## Como rodar (passo a passo manual)

### 1. Instalar as dependências

Descompacte o projeto, abra um terminal na pasta `acolher` e rode:

```bash
npm install
npx expo install --fix
```

O primeiro comando baixa as dependências. O segundo ajusta as versões para a do Expo instalada, o que é necessário porque o Expo Go só abre projetos da versão mais recente do SDK. O projeto usa o **Expo SDK 57** (React Native 0.86). O Expo Go do celular precisa aceitar o SDK 57.

Se você já tinha instalado uma versão anterior do projeto, apague `node_modules` e `package-lock.json` antes do `npm install`.

Pacotes usados:

| Pacote | Para que serve |
|---|---|
| `expo`, `react`, `react-native` | Base do app React Native com Expo |
| `@react-navigation/native`, `native-stack`, `bottom-tabs` | Navegação entre telas e barra de abas |
| `react-native-screens`, `react-native-safe-area-context` | Telas nativas e respeito ao notch/barra de status |
| `@expo/vector-icons` | Ícones (Feather e Material Community) |
| `expo-font`, `@expo-google-fonts/nunito` | Fonte Nunito, a mesma do protótipo |
| `expo-status-bar` | Cor da barra de status |
| `typescript`, `@types/react` (dev) | Tipagem TypeScript |

### 2. Iniciar

```bash
npm start
```

> Use `npm start`. O comando `npm run emulador-android` só funciona com o Android Studio instalado.
> Evite deixar o projeto dentro do **OneDrive**: a sincronização atrapalha o Metro. Prefira uma pasta como `C:\dev\acolher`.

Abra o **Expo Go** no celular e leia o QR code que aparece no terminal. No Android, a leitura é feita pelo próprio Expo Go; no iPhone, pela câmera. O celular e o computador precisam estar no mesmo Wi-Fi.

> **Não aperte `a` no terminal** se não tiver o Android Studio instalado. A tecla `a` abre um emulador e dá o erro `'adb' não é reconhecido`.

### Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| `Failed to resolve the Android SDK path` ou `'adb' não é reconhecido` | A tecla `a` foi pressionada sem Android Studio. Use o QR code com o Expo Go. |
| O Expo Go fica carregando e o terminal **não mostra** `Android Bundled …` | O celular não alcança o computador. Siga estes passos: (1) deixe celular e PC no mesmo Wi-Fi; (2) no Windows, marque a rede como **Privada** e permita o **Node.js** no Firewall; (3) abra `http://<IP do PC>:8081/status` no navegador do celular, que deve mostrar `packager-status:running`; (4) se nada disso funcionar, rode `npx expo start --tunnel`. |
| O terminal mostra `Android Bundled …`, mas a tela fica verde girando | Cache antigo. Pare o servidor e rode `npx expo start -c`. |
| O Expo Go diz que o projeto é de outro SDK | Confira a versão do Expo Go no celular. O projeto é SDK 57. Apague `node_modules` e `package-lock.json` e rode `npm install` e `npx expo install --fix`. |
| Aparece erro vermelho de módulo não encontrado | Rode `npm install` de novo e depois `npx expo install --fix`. |

Para conferir a tipagem: `npm run typecheck`.

## Próximos passos

- [ ] API de autenticação (usuário, senha e token JWT)
- [ ] Persistir acolhidos, registros, estoque e doações em banco de dados
- [ ] CRUD completo de acolhidos (cadastro e edição)
- [ ] Lembrete de horário de medicação

## Equipe

| Integrante | Papel |
|---|---|
| _Nome 1_ | Product Owner |
| _Nome 2_ | Scrum Master |
| _Nome 3_ | Desenvolvimento / UX |
| _Nome 4_ | Desenvolvimento |
