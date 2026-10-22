# ATIVIDADE PRÁTICA E PESQUISA EM EQUIPE (PPDM)
## Programação para Dispositivos Móveis — SENAI-SP

### 🏆 Desafio: Pesquisa Aplicada + Desenvolvimento de Projeto Mobile em React Native / Expo
* **Foco Temático:** Segurança (Autenticação & Proteção de Dados) e Qualidade (Resiliência & UX Mobile)
* **GRUPO 2 — Projeto:** "VaultKey App" (*SecureStore vs AsyncStorage*)
* **Tema de Pesquisa:** Armazenamento seguro de credenciais com `expo-secure-store` vs `AsyncStorage`.

---

## 👥 Integrantes
* **Alanis Venerruche de Carvalho** — N° 02
* **Ana Julia Menezes da Silva** — N° 05
* **Isabela Cristina Dessia Viana** — N° 09

---

## 💻 Desafio Prático de Codificação (React Native + Expo)
O grupo deve desenvolver uma tela com um formulário de **Configurações & Credenciais** contemplando os seguintes requisitos:

* **AsyncStorage:** Salvar dados de preferência comuns (ex: tema claro/escuro) utilizando o `@react-native-async-storage/async-storage`.
* **Expo SecureStore:** Salvar tokens de acesso, PIN ou chaves secretas utilizando o `expo-secure-store`.
* **Painel Visual:** Criar uma área na interface demonstrando onde cada dado foi armazenado e explicando visualmente por que o `AsyncStorage` não deve guardar senhas.
---

## 🔍 Comparativo Técnico: `expo-secure-store` vs `AsyncStorage`

| Característica       | `expo-secure-store`                                       | `AsyncStorage`                                                            |
| :------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------ |
| **Foco Principal**   | Segurança máxima para dados sensíveis.                    | Armazenamento persistente de uso geral.                                   |
| **Criptografia**     | **Sim.** Criptografa os dados em repouso de forma nativa. | **Não.** Os dados são salvos em texto puro (*plain text*).                |
| **Mecanismo Nativo** | Usa *Keychain* (iOS) e *Android Keystore* (Android).      | Usa arquivos de texto locais ou SQLite (dependendo da plataforma).        |
| **Limite de Tamanho**| Limitado a **2 KB** por chave.                            | Cerca de **6 MB** (pode variar, mas comporta grandes volumes).            |
| **Ideal para...**    | Tokens JWT, senhas, chaves de API, dados biométricos.     | Preferências do usuário, tema (*dark mode*), cache de dados não sensíveis |

---

## 🛡️ Fundamentação Teórica

### Por que o `AsyncStorage` não é seguro para credenciais?
O `AsyncStorage` não é seguro para o armazenamento de dados sensíveis, como senhas, tokens de autenticação e dados pessoais sensíveis, pois não realiza criptografia dos arquivos salvos no aparelho. Se o aparelho sofre um root (obter permissões de administrador do sistema operacional, permitindo modificar arquivos de fábrica, remover aplicativos do sistema e usar funções avançadas), qualquer aplicativo malicioso ou usuário com permissões avançadas consegue ler o sistema de arquivos e extrair essas informações facilmente.

Além disso, diferente de cofres de senhas do sistema operacional, o AsyncStorage não possui mecanismos de autenticação ou proteção contra leitura externa que não seja autorizada.

---

## 🚫 Quando usar (e NÃO usar) o Armazenamento Assíncrono

| Utilize armazenamento assíncrono quando...                        | Não utilize armazenamento assíncrono para...    |
| :---------------------------------------------------------------- | :---------------------------------------------- |
| Persistência de dados não sensíveis entre execuções do aplicativo | Armazenamento de tokens                         |
| Estado persistente do Redux                                       | Segredos                                        |
| Persistência do estado GraphQL                                    |                      -                          |
| Armazenar variáveis globais do aplicativo                         |                      -                          |

---

## 📚 Tecnologias Mencionadas

### O que é Redux?
O **Redux** é uma biblioteca de **gerenciamento de estado global** para aplicativos JavaScript. Quando o aplicativo é fechado, esse estado é perdido; por isso, utiliza-se o armazenamento assíncrono (como o `AsyncStorage` através do plugin `redux-persist`) para salvar o estado atual e recuperá-lo na próxima vez que o usuário abrir o app.

### O que é GraphQL?
O **GraphQL** é uma **linguagem de consulta e um ambiente de execução (runtime)** para APIs desenvolvida pelo Facebook. Diferente do REST tradicional (onde você acessa várias rotas fixas), no GraphQL o aplicativo faz uma única requisição especificando exatamente quais dados ele precisa, nem mais, nem menos. Ferramentas como o *Apollo Client* gerenciam o cache dessas requisições GraphQL, e utilizam o armazenamento assíncrono para persistir esse cache localmente, fazendo o app carregar mais rápido ou funcionar offline.

### Como funciona o `expo-secure-store`?
Ele atua como uma ponte (*bridge*) para os sistemas de segurança nativos do sistema operacional:
* **iOS (Keychain):** Os dados são criptografados e o acesso é restrito ao provisionamento do seu aplicativo. Mesmo que o app seja desinstalado, o *Keychain* pode reter as informações (dependendo da configuração).
* **Android (Keystore):** Os dados são criptografados usando chaves geradas e armazenadas no hardware dedicado de segurança do dispositivo (quando disponível).

---

## ⚙️ Resolução do Problema & Resiliência no Código

A solução prática foi projetada separando rigorosamente o fluxo de informações baseando-se na criticidade dos dados:
1. **Dados Não-Sensíveis (Tema e Usuário):** Gerenciados via `AsyncStorage`. Mesmo que lidos em texto limpo por terceiros, não comprometem a integridade da conta.
2. **Dados Sensíveis (Chave Secreta e PIN):** Salvos via `expo-secure-store`. No painel do inspetor visual do aplicativo, esses dados simulam a segurança real do hardware, mostrando-se ocultos/criptografados, contrastando com o dump limpo do AsyncStorage.
3. **Resiliência com `try/catch/finally`:** Criou-se uma função simuladora de carga de dados JSON corrompidos/nulos. O bloco intercepta a falha de análise sintática (`JSON.parse`), impede o travamento generalizado da aplicação (*crash*), adota um estado seguro por padrão e encerra o processamento limpando indicadores de carregamento na instrução `finally`.

---

## 🚀 Manual de Execução

Siga os passos abaixo no terminal para clonar e rodar a aplicação:

```bash
# 1. Instalar as dependências necessárias no projeto Expo
npx expo install @react-native-async-storage/async-storage expo-secure-store

# 2. Iniciar o servidor de desenvolvimento do Expo
# Opção A: Modo padrão Local Area Network (Mesmo Wi-Fi do celular)
npx expo start --lan

# Opção B: Modo Tunnel (Caso redes Wi-Fi sejam isoladas ou corporativas)
npx expo start --tunnel
```