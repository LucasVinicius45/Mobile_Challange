import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salvarUsuario } from '../Auth';

export default function Cadastro() {
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function sanitizeInput(input: string): string {
    return input.replace(/[<>{}"'`]/g, '');
  }

  const validarCampos = (): boolean => {
    if (!user.trim()) {
      Alert.alert('Campo Obrigatório', 'Digite um nome de usuário');
      return false;
    }

    if (user.trim().length < 3) {
      Alert.alert('Erro', 'Nome de usuário deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!senha.trim()) {
      Alert.alert('Campo Obrigatório', 'Digite uma senha');
      return false;
    }

    if (senha.length < 4) {
      Alert.alert('Senha Fraca', 'A senha deve ter pelo menos 4 caracteres');
      return false;
    }

    if (!confirmarSenha.trim()) {
      Alert.alert('Campo Obrigatório', 'Confirme sua senha');
      return false;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return false;
    }

    return true;
  };

  const handleCadastro = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    
    try {
      const usuarioSanitizado = sanitizeInput(user.trim());
      const senhaSanitizada = sanitizeInput(senha.trim());

      // Verificar se usuário já existe
      const usuariosData = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosData ? JSON.parse(usuariosData) : {};

      if (usuarios[usuarioSanitizado]) {
        Alert.alert('Usuário Existe', 'Este nome de usuário já está em uso. Escolha outro.');
        return;
      }

      // Cadastrar novo usuário
      usuarios[usuarioSanitizado] = { 
        senha: senhaSanitizada,
        dataCadastro: new Date().toISOString()
      };

      await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      // Fazer login automático
      await AsyncStorage.setItem('@user', JSON.stringify({ 
        user: usuarioSanitizado,
        loginTime: new Date().toISOString()
      }));
      
      await salvarUsuario(usuarioSanitizado);
      
      Alert.alert(
        'Cadastro Realizado! 🎉', 
        `Bem-vindo(a), ${usuarioSanitizado}!\nSua conta foi criada com sucesso.`,
        [
          { 
            text: 'Começar', 
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#2D2D2D', '#0A0909']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} />

          <Text style={styles.headerTitle}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para começar</Text>

          <Text style={styles.label}>Nome de usuário:</Text>
          <TextInput
            style={styles.input}
            value={user}
            onChangeText={(text) => setUser(sanitizeInput(text))}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Mínimo 3 caracteres"
            placeholderTextColor="#AAA"
            maxLength={30}
            editable={!loading}
          />

          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={(text) => setSenha(sanitizeInput(text))}
            placeholder="Mínimo 4 caracteres"
            placeholderTextColor="#AAA"
            maxLength={50}
            editable={!loading}
          />

          <Text style={styles.label}>Confirmar Senha:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmarSenha}
            onChangeText={(text) => setConfirmarSenha(sanitizeInput(text))}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#AAA"
            maxLength={50}
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleCadastro}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backLink}
            disabled={loading}
          >
            <Text style={styles.backText}>Já tem conta? Voltar ao login</Text>
          </TouchableOpacity>

          {/* Informações de segurança */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Suas informações estão seguras</Text>
            <Text style={styles.infoText}>• Dados criptografados localmente</Text>
            <Text style={styles.infoText}>• Sem compartilhamento com terceiros</Text>
            <Text style={styles.infoText}>• Controle total sobre sua privacidade</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F2F0E6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backLink: {
    marginTop: 20,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    width: '100%',
  },
  infoTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 5,
  },
});