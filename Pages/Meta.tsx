import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Meta() {
  const [nomeMeta, setNomeMeta] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [metaAtual, setMetaAtual] = useState({ nome: '', valor: 0 });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    carregarMetaAtual();
  }, []);

  const carregarMetaAtual = async () => {
    try {
      const metaData = await AsyncStorage.getItem('meta');
      if (metaData) {
        const meta = JSON.parse(metaData);
        setMetaAtual(meta);
        setNomeMeta(meta.nome);
        setValorMeta(meta.valor.toString());
      }
    } catch (error) {
      console.error('Erro ao carregar meta:', error);
    }
  };

  function sanitizeInput(input: string): string {
    return input.replace(/[<>{}"'`]/g, '');
  }

  const validarCampos = (): boolean => {
    if (!nomeMeta.trim()) {
      Alert.alert('Erro', 'Digite o nome da sua meta (ex: Carro, Casa, Viagem)');
      return false;
    }
    
    if (!valorMeta.trim()) {
      Alert.alert('Erro', 'Digite o valor da meta em reais');
      return false;
    }

    const valor = parseFloat(valorMeta.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Erro', 'Digite um valor válido maior que zero');
      return false;
    }

    if (valor > 10000000) {
      Alert.alert('Erro', 'Valor muito alto! Digite um valor realista');
      return false;
    }

    if (nomeMeta.length < 2) {
      Alert.alert('Erro', 'Nome da meta deve ter pelo menos 2 caracteres');
      return false;
    }

    return true;
  };

  const formatarMoeda = (valor: string): string => {
    const numero = valor.replace(/\D/g, '');
    return numero.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const calcularTempo = (valorMeta: number): string => {
    const economiaMensal = 200; // R$ 200 por mês
    const meses = Math.ceil(valorMeta / economiaMensal);
    
    if (meses <= 12) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    } else {
      const anos = Math.floor(meses / 12);
      const mesesRestantes = meses % 12;
      
      if (mesesRestantes === 0) {
        return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
      } else {
        return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`;
      }
    }
  };

  const ativarMeta = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    
    try {
      const valorNumerico = parseFloat(valorMeta.replace(/\./g, '').replace(',', '.'));
      
      const novaMeta = {
        nome: sanitizeInput(nomeMeta.trim()),
        valor: valorNumerico,
        dataAtivacao: new Date().toISOString(),
      };

      await AsyncStorage.setItem('meta', JSON.stringify(novaMeta));
      
      const tempoEstimado = calcularTempo(valorNumerico);
      
      Alert.alert(
        'Meta Definida! 🎯', 
        `Meta: ${novaMeta.nome}\nValor: R$ ${valorNumerico.toLocaleString('pt-BR')}\n\nCom economia de R$ 200/mês, você alcançará sua meta em aproximadamente ${tempoEstimado}!`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      Alert.alert('Erro', 'Não foi possível salvar a meta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const excluirMeta = async () => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir sua meta atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('meta');
              setMetaAtual({ nome: '', valor: 0 });
              setNomeMeta('');
              setValorMeta('');
              Alert.alert('Sucesso', 'Meta excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a meta');
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#2D2D2D', '#0A0909']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Definir Meta Financeira</Text>
        <Text style={styles.subtitle}>
          Configure uma meta para motivar sua economia ao parar de apostar
        </Text>

        {/* Meta atual */}
        {metaAtual.valor > 0 && (
          <View style={styles.metaAtualCard}>
            <Text style={styles.metaAtualTitle}>Meta Atual:</Text>
            <Text style={styles.metaAtualNome}>{metaAtual.nome}</Text>
            <Text style={styles.metaAtualValor}>R$ {metaAtual.valor.toLocaleString('pt-BR')}</Text>
            <TouchableOpacity style={styles.excluirButton} onPress={excluirMeta}>
              <Text style={styles.excluirText}>Excluir Meta</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Formulário */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Nome da meta:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: PlayStation 5, Carro, Viagem..."
            placeholderTextColor="#AAA"
            value={nomeMeta}
            onChangeText={(text) => setNomeMeta(sanitizeInput(text))}
            maxLength={50}
            editable={!loading}
          />

          <Text style={styles.label}>Valor (R$):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 4500"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            value={valorMeta}
            onChangeText={(text) => {
              const sanitized = sanitizeInput(text);
              setValorMeta(formatarMoeda(sanitized));
            }}
            maxLength={15}
            editable={!loading}
          />

          {/* Previsão */}
          {valorMeta && !isNaN(parseFloat(valorMeta.replace(/\./g, '').replace(',', '.'))) && (
            <View style={styles.previsaoCard}>
              <Text style={styles.previsaoTitle}>Previsão de Economia:</Text>
              <Text style={styles.previsaoText}>
                Economizando R$ 200/mês, você alcançará sua meta em:
              </Text>
              <Text style={styles.previsaoTempo}>
                {calcularTempo(parseFloat(valorMeta.replace(/\./g, '').replace(',', '.')))}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={ativarMeta}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Salvando...' : (metaAtual.valor > 0 ? 'Atualizar Meta' : 'Definir Meta')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dicas */}
        <View style={styles.dicasCard}>
          <Text style={styles.dicasTitle}>💡 Dicas para sua meta:</Text>
          <Text style={styles.dicaText}>• Escolha algo que realmente te motive</Text>
          <Text style={styles.dicaText}>• Seja realista com o valor</Text>
          <Text style={styles.dicaText}>• Visualize sua meta todos os dias</Text>
          <Text style={styles.dicaText}>• Comemore pequenos progressos</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  metaAtualCard: {
    backgroundColor: '#1a4a3a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  metaAtualTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metaAtualNome: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metaAtualValor: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  excluirButton: {
    backgroundColor: '#444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  excluirText: {
    color: '#FF6B6B',
    fontSize: 12,
  },
  formCard: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#FFFFFF',
    marginBottom: 20,
    fontSize: 16,
  },
  previsaoCard: {
    backgroundColor: 'rgba(0, 163, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  previsaoTitle: {
    color: '#00A3FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previsaoText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
  },
  previsaoTempo: {
    color: '#00A3FF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F2F0E6',
    paddingVertical: 15,
    borderRadius: 10,
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
  dicasCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
  },
  dicasTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dicaText: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 30,
  },
});