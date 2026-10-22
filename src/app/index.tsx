import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function VaultKeyScreen() {
  const [theme, setTheme] = useState('light');
  const [username, setUsername] = useState('');
  const [secretToken, setSecretToken] = useState('');
  const [userPin, setUserPin] = useState('');

  const [inspectorData, setInspectorData] = useState({
    asyncStorageDump: {},
    secureStoreDump: {},
  });

  const isDarkMode = theme === 'dark';

  const loadSavedData = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@vaultkey_theme');
      const storedUser = await AsyncStorage.getItem('@vaultkey_username');

      if (storedTheme) setTheme(storedTheme);
      if (storedUser) setUsername(storedUser);

      let storedToken = null;
      let storedPin = null;

      if (Platform.OS !== 'web' && SecureStore.isAvailableAsync && await SecureStore.isAvailableAsync()) {
        storedToken = await SecureStore.getItemAsync('auth_access_token');
        storedPin = await SecureStore.getItemAsync('user_pin_code');
        if (storedToken) setSecretToken(storedToken);
        if (storedPin) setUserPin(storedPin);
      } else {
        storedToken = localStorage.getItem('auth_access_token');
        storedPin = localStorage.getItem('user_pin_code');
        if (storedToken) setSecretToken(storedToken);
        if (storedPin) setUserPin(storedPin);
      }

      setInspectorData({
        asyncStorageDump: {
          '@vaultkey_theme': storedTheme || 'Vazio',
          '@vaultkey_username': storedUser || 'Vazio',
        },
        secureStoreDump: {
          auth_access_token: storedToken ? '[CRIPTOGRAFADO / OCULTO]' : 'Vazio',
          user_pin_code: storedPin ? '[CRIPTOGRAFADO / OCULTO]' : 'Vazio',
        },
      });
    } catch (e) {
      console.error('Erro ao carregar dados iniciais:', e);
    }
  };

  useEffect(() => {
    loadSavedData();
  }, []);


  //Armazenamento de dados comuns usando AsyncStorage. Esse armazenamento é persistente e adequado para salvar dados não sensíveis, como preferências do usuário, que no caso é a preferência de tema e o nome do usuário.
  const handleSavePreferences = async () => {
    try {
      await AsyncStorage.setItem('@vaultkey_theme', theme);
      await AsyncStorage.setItem('@vaultkey_username', username);
      showAlert('AsyncStorage', 'Preferências salvas com sucesso!');
      inspectStorage();
    } catch (e) {
      showAlert('Erro', 'Falha ao salvar no AsyncStorage');
    }
  };

  //Armazenamento de dados sensíveis usando SecureStore, tais como tokens, PIN ou chave secreta. Esse armazenamento é criptografado e adequado para salvar informações confidenciais, garantindo que esses dados não sejam facilmente acessíveis por aplicativos maliciosos ou exploradores de arquivos.
  const handleSaveSecureData = async () => {
    try {
      if (Platform.OS !== 'web' && SecureStore.isAvailableAsync && await SecureStore.isAvailableAsync()) {
  // No dispositivo móvel, grava na camada nativa segura (Keychain / Keystore) com criptografia
        await SecureStore.setItemAsync('auth_access_token', secretToken);
        await SecureStore.setItemAsync('user_pin_code', userPin);
      } else {
        localStorage.setItem('auth_access_token', secretToken);
        localStorage.setItem('user_pin_code', userPin);
      }
      showAlert('SecureStore', 'Credenciais salvas com sucesso!');
      inspectStorage();
    } catch (e) {
      showAlert('Erro', 'Falha ao salvar as credenciais');
    }
  };

  const inspectStorage = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@vaultkey_theme');
      const storedUser = await AsyncStorage.getItem('@vaultkey_username');

      let storedToken = null;
      let storedPin = null;

      if (Platform.OS !== 'web' && SecureStore.isAvailableAsync && await SecureStore.isAvailableAsync()) {
        storedToken = await SecureStore.getItemAsync('auth_access_token');
        storedPin = await SecureStore.getItemAsync('user_pin_code');
      } else {
        storedToken = localStorage.getItem('auth_access_token');
        storedPin = localStorage.getItem('user_pin_code');
      }

      setInspectorData({
        asyncStorageDump: {
          '@vaultkey_theme': storedTheme || 'Vazio',
          '@vaultkey_username': storedUser || 'Vazio',
        },
        secureStoreDump: {
          auth_access_token: storedToken ? '[CRIPTOGRAFADO / OCULTO]' : 'Vazio',
          user_pin_code: storedPin ? '[CRIPTOGRAFADO / OCULTO]' : 'Vazio',
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.bgDark : styles.bgLight]}>

      <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>
        VaultKey — Configurações & Credenciais
      </Text>

      <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>⚙️ Preferências (AsyncStorage)</Text>
        <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>Usuário:</Text>
        <TextInput
          style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
          placeholder="Ex: joao.silva"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.row}>
          <Text style={isDarkMode ? styles.textDark : styles.textLight}>Tema Escuro?</Text>
          <Switch
            value={isDarkMode}
            onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
          />
        </View>
        <Button title="Salvar Preferências" onPress={handleSavePreferences} />
      </View>

      <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>
          🔒 Dados Sensíveis {Platform.OS === 'web' ? '(Web LocalStorage)' : '(Expo SecureStore)'}
        </Text>
        <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>Token de Acesso (API):</Text>
        <TextInput
          style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
          placeholder="eyJhbGciOiJIUzI1NiIs..."
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          secureTextEntry
          value={secretToken}
          onChangeText={setSecretToken}
        />
        <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>PIN Secreto:</Text>
        <TextInput
          style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
          placeholder="1234"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          keyboardType="numeric"
          secureTextEntry
          value={userPin}
          onChangeText={setUserPin}
        />
        <Button title="Salvar com Segurança" color="#d9534f" onPress={handleSaveSecureData} />
      </View>

      <View style={[styles.card, styles.inspectorCard]}>
        <Text style={styles.sectionTitleInspector}>📊 Painel de Inspeção do Armazenamento</Text>
        <Button title="Atualizar Painel de Visualização" onPress={inspectStorage} />

        <View style={styles.boxGroup}>
          <Text style={styles.subHeader}>❌ AsyncStorage (Texto Plano / Desprotegido):</Text>
          <Text style={styles.codeText}>{JSON.stringify(inspectorData.asyncStorageDump, null, 2)}</Text>
          <Text style={styles.warningText}>
            ⚠️ Qualquer aplicativo malicioso ou explorador de arquivos lê isso instantaneamente.
          </Text>
        </View>

        <View style={styles.boxGroup}>
          <Text style={styles.subHeader}>
            ✅ {Platform.OS === 'web' ? 'LocalStorage simulado:' : 'Expo SecureStore (Criptografado no OS):'}
          </Text>
          <Text style={styles.codeText}>{JSON.stringify(inspectorData.secureStoreDump, null, 2)}</Text>
          <Text style={styles.safeText}>
            🛡️ Em dispositivos móveis reais, isso é criptografado via iOS Keychain / Android Keystore.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Fundos gerais da tela
  container: { flex: 1, padding: 16 },
  bgLight: { backgroundColor: '#f5f5f5' },
  bgDark: { backgroundColor: '#121212' },

  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  sectionTitleInspector: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#fff' },
  label: { fontSize: 14, marginBottom: 4, fontWeight: '500' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

  // Cores de textos comuns
  textLight: { color: '#000000' },
  textDark: { color: '#ffffff' },

  // Estilos de Inputs
  input: { borderWidth: 1, borderRadius: 4, padding: 8, marginBottom: 12 },
  inputLight: { borderColor: '#ccc', backgroundColor: '#fff', color: '#000' },
  inputDark: { borderColor: '#444', backgroundColor: '#1e1e1e', color: '#fff' },

  // Estilos de Cartões
  card: { padding: 16, borderRadius: 8, marginBottom: 16, elevation: 2 },
  cardLight: { backgroundColor: '#fff' },
  cardDark: { backgroundColor: '#1e1e1e' },

  // Painel de inspeção (estático escuro para contraste)
  inspectorCard: { backgroundColor: '#2f3640' },
  boxGroup: { marginTop: 12, backgroundColor: '#1e272e', padding: 10, borderRadius: 6 },
  subHeader: { color: '#fbc531', fontWeight: 'bold', marginBottom: 4 },
  codeText: { color: '#00cec9', fontFamily: 'monospace', marginBottom: 4 },
  warningText: { color: '#ff7675', fontSize: 12 },
  safeText: { color: '#55efc4', fontSize: 12 },
});
