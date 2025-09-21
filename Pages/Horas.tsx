import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width - 40;

export default function Horas() {
  const [dadosHoras, setDadosHoras] = useState({ sem1: 6, sem2: 4, sem3: 5, sem4: 3 });
  const [bloqueado, setBloqueado] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carregar dados das horas
      const horasSalvas = await AsyncStorage.getItem('horasApostando');
      if (horasSalvas) {
        setDadosHoras(JSON.parse(horasSalvas));
      }

      // Carregar status do bloqueio
      const bloqueioSalvo = await AsyncStorage.getItem('bloqueio');
      if (bloqueioSalvo !== null) {
        setBloqueado(JSON.parse(bloqueioSalvo));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const alternarBloqueio = async () => {
    try {
      const novoEstado = !bloqueado;
      setBloqueado(novoEstado);
      await AsyncStorage.setItem('bloqueio', JSON.stringify(novoEstado));
      
      Alert.alert(
        novoEstado ? 'Apps Bloqueados! 🔒' : 'Bloqueio Removido 🔓', 
        novoEstado 
          ? 'Os aplicativos de apostas foram bloqueados em seu dispositivo.' 
          : 'Os aplicativos de apostas foram liberados.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao alterar bloqueio:', error);
      Alert.alert('Erro', 'Não foi possível alterar o bloqueio');
    }
  };

  const calcularTotalHoras = () => {
    return dadosHoras.sem1 + dadosHoras.sem2 + dadosHoras.sem3 + dadosHoras.sem4;
  };

  const calcularMedia = () => {
    const total = calcularTotalHoras();
    return (total / 4).toFixed(1);
  };

  const obterTendencia = () => {
    const { sem1, sem2, sem3, sem4 } = dadosHoras;
    if (sem4 < sem3 && sem3 < sem2) return { texto: 'Melhorando! 📈', cor: '#4CAF50' };
    if (sem4 > sem3 && sem3 > sem2) return { texto: 'Atenção! 📊', cor: '#FF9800' };
    return { texto: 'Estável', cor: '#00A3FF' };
  };

  const chartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        data: [dadosHoras.sem1, dadosHoras.sem2, dadosHoras.sem3, dadosHoras.sem4],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#000',
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#00A3FF"
    },
    barPercentage: 0.7,
  };

  const tendencia = obterTendencia();

  if (loading) {
    return (
      <LinearGradient colors={['#2D2D2D', '#0A0909']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#2D2D2D', '#0A0909']} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Análise de Horas</Text>
        <Text style={styles.subtitle}>Monitoramento semanal de apostas</Text>

        {/* Gráfico */}
        <View style={styles.card}>
          <Text style={styles.title}>Horas apostando por semana:</Text>
          <BarChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix="h"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={{ borderRadius: 16 }}
            fromZero={true}
          />
        </View>

        {/* Estatísticas */}
        <View style={styles.card}>
          <Text style={styles.title}>Estatísticas do Mês:</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{calcularTotalHoras()}h</Text>
              <Text style={styles.statLabel}>Total do Mês</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{calcularMedia()}h</Text>
              <Text style={styles.statLabel}>Média Semanal</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: tendencia.cor }]}>{dadosHoras.sem4}h</Text>
              <Text style={styles.statLabel}>Semana Atual</Text>
            </View>
          </View>

          <View style={styles.tendenciaContainer}>
            <Text style={styles.tendenciaLabel}>Tendência:</Text>
            <Text style={[styles.tendenciaTexto, { color: tendencia.cor }]}>
              {tendencia.texto}
            </Text>
          </View>
        </View>

        {/* Bloqueador de Apps */}
        <View style={styles.cardBloqueio}>
          <Text style={styles.title}>Bloqueador de Apps</Text>
          <Text style={styles.bloqueioSubtitle}>
            Controle o acesso aos aplicativos de apostas
          </Text>

          <TouchableOpacity style={styles.lockBox} onPress={alternarBloqueio}>
            <View style={[styles.lockIconContainer, bloqueado && styles.lockIconActive]}>
              <Ionicons 
                name={bloqueado ? "lock-closed" : "lock-open"} 
                size={40} 
                color={bloqueado ? "#FFF" : "#666"} 
              />
            </View>
            <View style={styles.lockTextContainer}>
              <Text style={[styles.lockText, bloqueado && styles.lockTextActive]}>
                {bloqueado ? 'ATIVADO' : 'DESATIVADO'}
              </Text>
              <Text style={styles.lockSubText}>
                {bloqueado 
                  ? 'Apps de apostas bloqueados' 
                  : 'Toque para bloquear apps'
                }
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.bloqueioInfo}>
            <Text style={styles.infoTitle}>Como funciona:</Text>
            <Text style={styles.infoText}>• Bloqueia acesso aos principais apps de apostas</Text>
            <Text style={styles.infoText}>• Ajuda a resistir aos impulsos</Text>
            <Text style={styles.infoText}>• Pode ser ativado/desativado a qualquer momento</Text>
          </View>
        </View>

        {/* Recomendações */}
        <View style={styles.recomendacoesCard}>
          <Text style={styles.recomendacoesTitle}>Recomendações Personalizadas</Text>
          
          {dadosHoras.sem4 <= 2 && (
            <View style={styles.recomendacao}>
              <Text style={styles.recomendacaoTitulo}>Parabéns! Você está indo bem!</Text>
              <Text style={styles.recomendacaoTexto}>Mantenha esse controle e continue focado em suas metas.</Text>
            </View>
          )}

          {dadosHoras.sem4 > 2 && dadosHoras.sem4 <= 5 && (
            <View style={styles.recomendacao}>
              <Text style={styles.recomendacaoTitulo}>Atenção ao tempo gasto</Text>
              <Text style={styles.recomendacaoTexto}>Tente reduzir gradualmente o tempo de apostas.</Text>
            </View>
          )}

          {dadosHoras.sem4 > 5 && (
            <View style={styles.recomendacao}>
              <Text style={styles.recomendacaoTitulo}>Considere buscar ajuda</Text>
              <Text style={styles.recomendacaoTexto}>O tempo elevado pode indicar comportamento compulsivo. Considere apoio profissional.</Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardBloqueio: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  bloqueioSubtitle: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#00A3FF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#CCC',
    fontSize: 12,
    marginTop: 5,
  },
  tendenciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  tendenciaLabel: {
    color: '#FFF',
    fontSize: 14,
    marginRight: 10,
  },
  tendenciaTexto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lockBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    marginBottom: 20,
  },
  lockIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  lockIconActive: {
    backgroundColor: '#4CAF50',
  },
  lockTextContainer: {
    flex: 1,
  },
  lockText: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockTextActive: {
    color: '#4CAF50',
  },
  lockSubText: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 5,
  },
  bloqueioInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
  },
  infoTitle: {
    color: '#00A3FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 4,
  },
  recomendacoesCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  recomendacoesTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  recomendacao: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
  },
  recomendacaoTitulo: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recomendacaoTexto: {
    color: '#CCC',
    fontSize: 12,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 30,
  },
});