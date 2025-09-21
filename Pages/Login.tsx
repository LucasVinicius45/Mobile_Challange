import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salvarUsuario, verificarAutenticacao } from '../Auth';

export default function Login() {
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Verificar se já está logado
    const verificarLogin = async () => {
      const estaLogado = await verificarAutenticacao();
      if (estaLogado) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    };
    verificarLogin();
  }, []);

  // Função para sanitizar entrada do usuário
  function sanitizeInput(input: string): string {
    return input.replace(/[<>{}"'`]/g, '').trim();
  }

  // Validação dos campos
  const validarCampos = (): boolean => {
    if (!user.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, digite o nome de usuário.');
      return false;
    }
    if (!senha.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, digite a senha.');
      return false;
    }
    if (user.trim().length < 3) {
      Alert.alert('Erro', 'Nome de usuário deve ter pelo menos 3 caracteres.');
      return false;
    }
    return true;
  };

  // Função principal de login
  const handleLogin = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    
    try {
      const usuarioSanitizado = sanitizeInput(user);
      const senhaSanitizada = sanitizeInput(senha);

      // Buscar usuários cadastrados
      const usuariosData = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosData ? JSON.parse(usuariosData) : {};

      const usuarioExistente = usuarios[usuarioSanitizado];

      if (usuarioExistente && usuarioExistente.senha === senhaSanitizada) {
        // Login bem-sucedido
        await AsyncStorage.setItem('@user', JSON.stringify({ 
          user: usuarioSanitizado,
          loginTime: new Date().toISOString()
        }));
        
        // Salvar no log de usuários
        await salvarUsuario(usuarioSanitizado);

        Alert.alert('Sucesso', `Bem-vindo(a), ${usuarioSanitizado}!`, [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          }
        ]);
      } else {
        Alert.alert(
          'Erro de Login', 
          'Nome de usuário ou senha incorretos.\n\nDica: Usuário padrão é "admin" com senha "12345"'
        );
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#2D2D2D', '#0A0909']} style={styles.container}>
      <View style={styles.loginBox}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
        
        <Text style={styles.welcomeText}>Faça seu login</Text>

        <TextInput
          placeholder="Nome de usuário"
          placeholderTextColor="#CCCCCC"
          style={styles.input}
          value={user}
          onChangeText={(text) => setUser(sanitizeInput(text))}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          maxLength={50}
        />
        
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#CCCCCC"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={(text) => setSenha(sanitizeInput(text))}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          maxLength={50}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Cadastro')}
          disabled={loading}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>Não possui conta? Cadastre-se!</Text>
        </TouchableOpacity>

        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>Dados de demonstração:</Text>
          <Text style={styles.demoCredentials}>Usuário: admin</Text>
          <Text style={styles.demoCredentials}>Senha: 12345</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginBox: {
    width: 280,
    alignItems: 'center',
    padding: 20,
    alignSelf: 'center',
    marginTop: '30%',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F2F0E6',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 10,
    minHeight: 50,
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  demoInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  demoText: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 5,
  },
  demoCredentials: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});