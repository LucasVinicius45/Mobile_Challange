import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigationHandler, mostrarLogUsuarios, logout, obterUsuarioAtual } from '../Auth';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const { navi } = useNavigationHandler();
  const [meta, setMeta] = useState({ nome: 'PlayStation 5', valor: 4500 });
  const [horasSemana, setHorasSemana] = useState(3);
  const [usuarioAtual, setUsuarioAtual] = useState('');
  const [bloqueado, setBloqueado] = useState(false);

  const economiaMensal = 200; // Valor fixo para demonstração

  // Carregar dados sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        try {
          // Carregar usuário atual
          const userData = await obterUsuarioAtual();
          if (userData) {
            setUsuarioAtual(userData.user);
          }

          // Carregar meta
          const metaData = await AsyncStorage.getItem('meta');
          if (metaData) {
            setMeta(JSON.parse(metaData));
          }

          // Carregar horas de apostas
          const horasData = await AsyncStorage.getItem('horasApostando');
          if (horasData) {
            const horas = JSON.parse(horasData);
            setHorasSemana(horas.sem4 || 3);
          }

          // Carregar status do bloqueio
          const bloqueioData = await AsyncStorage.getItem('bloqueio');
          if (bloqueioData !== null) {
            setBloqueado(JSON.parse(bloqueioData));
          }
        } catch (error) {
          console.error('Erro ao carregar dados da home:', error);
          Alert.alert('Erro', 'Não foi possível carregar alguns dados');
        }
      };

      carregarDados();
    }, [])
  );

  // Função para calcular progresso
  const calcularProgresso = () => {
    const economiaTotal = economiaMensal * 24; // 2 anos
    if (meta.valor > 0) {
      return Math.round((economiaTotal / meta.valor) * 100);
    }
    return 0;
  };

  // Função de logout melhorada
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await mostrarLogUsuarios(); // Debug
              await logout();
              navi('Login');
            } catch (error) {
              console.error('Erro no logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout');
            }
          }
        }
      ]
    );
  };

  // Determinar perfil de risco
  const obterPerfilRisco = () => {
    if (horasSemana <= 2) return 'Baixo';
    if (horasSemana <= 5) return 'Médio';
    return 'Alto';
  };

  // Cor do perfil de risco
  const obterCorPerfil = (perfil: string) => {
    switch (perfil) {
      case 'Baixo': return '#4CAF50';
      case 'Médio': return '#FF9800';
      case 'Alto': return '#F44336';
      default: return '#00A3FF';
    }
  };

  const perfilAtual = obterPerfilRisco();

  return (
    <LinearGradient colors={['#2D2D2D', '#0A0909']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com boas-vindas */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Olá, {usuarioAtual}! 👋
          </Text>
          <Text style={styles.subWelcomeText}>
            Acompanhe seu progresso
          </Text>
        </View>

        {/* Card da Meta */}
        <View style={styles.card}>
          <Text style={styles.title}>Meta de gastos com apostas este mês:</Text>
          <Text style={styles.valorMeta}>R$ 300,00</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Limite estabelecido para controle</Text>
          </View>
        </View>

        {/* Card do Perfil */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Seu padrão de apostas compulsivas é classificado como:
          </Text>
          <View style={styles.perfilContainer}>
            {['Baixo', 'Médio', 'Alto'].map((perfil) => (
              <View 
                key={perfil}
                style={[
                  styles.perfilBox, 
                  perfil === perfilAtual && {
                    backgroundColor: obterCorPerfil(perfil),
                    borderColor: obterCorPerfil(perfil)
                  }
                ]}
              >
                <Text style={[
                  styles.perfilText,
                  perfil === perfilAtual && styles.perfilTextSelecionado
                ]}>
                  {perfil}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.perfilDescricao}>
            {perfilAtual === 'Baixo' && 'Continue assim! Você está no controle.'}
            {perfilAtual === 'Médio' && 'Atenção! Monitore seus hábitos.'}
            {perfilAtual === 'Alto' && 'Cuidado! Considere buscar ajuda profissional.'}
          </Text>
        </View>

        {/* Card das Horas */}
        <View style={styles.card}>
          <Text style={styles.title}>Horas apostando esta semana:</Text>
          <Text style={styles.horasNumero}>{horasSemana}h</Text>
          <Text style={styles.mensagem}>
            {horasSemana <= 3 
              ? `Parabéns! Você manteve apenas ${horasSemana} hora(s) esta semana!` 
              : `Você apostou ${horasSemana} hora(s) esta semana. Tente reduzir!`
            }
          </Text>
          <TouchableOpacity
            style={styles.detalhesButton}
            onPress={() => navi('Horas')}
          >
            <Text style={styles.detalhesText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Status do Bloqueio */}
        <View style={styles.card}>
          <Text style={styles.title}>Status do Bloqueador:</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, bloqueado && styles.statusAtivo]} />
            <Text style={styles.statusText}>
              {bloqueado ? 'Apps bloqueados' : 'Apps liberados'}
            </Text>
          </View>
        </View>

        {/* Card da Economia */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Se você economizar R$ {economiaMensal},00 por mês:
          </Text>
          <Text style={styles.resultado}>
            • 6 meses → R$ {(economiaMensal * 6).toLocaleString('pt-BR')},00
          </Text>
          <Text style={styles.resultado}>
            • 12 meses → R$ {(economiaMensal * 12).toLocaleString('pt-BR')},00
          </Text>
          <Text style={styles.resultado}>
            • 24 meses → R$ {(economiaMensal * 24).toLocaleString('pt-BR')},00
          </Text>
          {meta.valor > 0 && (
            <Text style={styles.resultadoDestaque}>
              💰 {calcularProgresso()}% do valor de um {meta.nome}
            </Text>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={() => navi('Meta')}>
            <Text style={styles.actionText}>Alterar Meta</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  welcomeText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subWelcomeText: {
    color: '#CCC',
    fontSize: 16,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  valorMeta: {
    color: '#00A3FF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: '#AAA',
    fontSize: 12,
  },
  perfilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  perfilBox: {
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  perfilText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  perfilTextSelecionado: {
    color: '#000',
  },
  perfilDescricao: {
    color: '#CCC',
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
  horasNumero: {
    color: '#00A3FF',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  mensagem: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  detalhesButton: {
    backgroundColor: '#DDD',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  detalhesText: {
    color: '#000',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#555',
    marginRight: 10,
  },
  statusAtivo: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
  },
  resultado: {
    color: '#FFF',
    marginVertical: 3,
    fontSize: 15,
  },
  resultadoDestaque: {
    color: '#00A3FF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  actionText: {
    color: '#00A3FF',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 10,
  },
  logoutText: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 30,
  },
});