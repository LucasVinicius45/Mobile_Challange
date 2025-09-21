# ControleBet - Aplicativo de Controle de Apostas

## 📱 Sobre o Projeto

O **ControleBet** é um aplicativo mobile desenvolvido em React Native que tem como objetivo ajudar usuários a monitorar e controlar seus hábitos de apostas. O app oferece ferramentas de análise comportamental, definição de metas financeiras e bloqueio de aplicativos, promovendo o jogo responsável e a consciência financeira.

## 👥 Equipe de Desenvolvimento

- **Irana Pereira** – RM98593
- **Lucas Vinicius** – RM98480
- **Mariana Melo** – RM98121
- **Mateus Iago** – RM550270


## 🎯 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login seguro com validação de credenciais
- Cadastro de novos usuários
- Sanitização de inputs para segurança
- Persistência de sessão com AsyncStorage
- Sistema de logout completo

### 📊 Dashboard Principal (Home)
- Visualização de meta de gastos mensal
- Análise do perfil de risco (Baixo/Médio/Alto)
- Monitoramento de horas apostando na semana
- Status do bloqueador de aplicativos
- Calculadora de economia projetada (6, 12 e 24 meses)
- Progresso em relação às metas financeiras

### 📈 Análise Detalhada (Horas)
- Gráfico de barras mostrando histórico semanal
- Estatísticas do mês (total de horas, média semanal)
- Análise de tendência comportamental
- Recomendações personalizadas baseadas no uso
- Sistema de bloqueador de apps de apostas
- Informações educativas sobre controle

### 🎯 Definição de Metas (Meta)
- Criação de metas financeiras personalizadas
- Cálculo automático de tempo para alcançar objetivos
- Visualização do progresso atual
- Edição e exclusão de metas existentes
- Dicas motivacionais para manter o foco

### 👤 Gestão de Usuários (Cadastro)
- Criação de novas contas com validação
- Verificação de disponibilidade de usuário
- Validação de senhas seguras
- Informações sobre privacidade e segurança
- Interface intuitiva e acessível

## 🛠️ Tecnologias Utilizadas

### Core
- **React Native** - Framework principal
- **TypeScript** - Tipagem estática
- **Expo** - Plataforma de desenvolvimento

### Navegação
- **@react-navigation/native** - Sistema de navegação
- **@react-navigation/native-stack** - Stack navigator

### Interface
- **expo-linear-gradient** - Gradientes visuais
- **@expo/vector-icons** - Biblioteca de ícones
- **react-native-chart-kit** - Gráficos e visualizações

### Armazenamento
- **@react-native-async-storage/async-storage** - Persistência local

### Gráficos
- **react-native-svg** - Renderização de SVG para gráficos

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio ou Xcode (para emuladores)
- Dispositivo físico com Expo Go (opcional)

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
cd Sprint-MobileDevelop
```

### 2. Instale as dependências
```bash
npm install --legacy-peer-deps
```

### 3. Instale dependências específicas do Expo
```bash
npx expo install react-native-screens react-native-safe-area-context
```

### 4. Execute o projeto
```bash
npx expo start
```

### 5. Visualize o app
- Escaneie o QR Code com o Expo Go (dispositivo físico)
- Pressione 'a' para Android emulator
- Pressione 'i' para iOS simulator

## 🔑 Credenciais de Teste

Para facilitar os testes, o aplicativo vem com um usuário pré-configurado:

- **Usuário:** `admin`
- **Senha:** `12345`

Você também pode criar uma nova conta através da tela de cadastro.

## 📁 Estrutura do Projeto

```
Sprint-MobileDevelop/
├── assets/                 # Imagens e recursos
│   ├── Logo.png
│   ├── cadeadoAberto.png
│   └── cadeadoFechado.png
├── Pages/                  # Telas da aplicação
│   ├── Login.tsx          # Tela de autenticação
│   ├── Cadastro.tsx       # Tela de registro
│   ├── Home.tsx           # Dashboard principal
│   ├── Meta.tsx           # Definição de metas
│   └── Horas.tsx          # Análise detalhada
├── App.tsx                 # Componente principal
├── Auth.tsx                # Funções de autenticação
├── SaveInformation.tsx     # Dados iniciais
├── index.js                # Entry point
└── package.json            # Dependências
```

## 🎨 Design e Interface

### Paleta de Cores
- **Primária:** Gradiente escuro (#2D2D2D → #0A0909)
- **Destaque:** Azul (#00A3FF)
- **Sucesso:** Verde (#4CAF50)
- **Atenção:** Laranja (#FF9800)
- **Erro:** Vermelho (#F44336)
- **Texto:** Branco (#FFFFFF) / Cinza (#CCCCCC)

### Componentes Principais
- Cards com bordas arredondadas
- Gradientes lineares para backgrounds
- Gráficos interativos e responsivos
- Botões com feedback visual
- Indicadores de status dinâmicos

## 📊 Dados e Persistência

### Informações Armazenadas
- **Usuários:** Credenciais e dados de cadastro
- **Sessão:** Usuário atual logado
- **Metas:** Objetivos financeiros definidos
- **Horas:** Histórico de tempo apostando
- **Configurações:** Status do bloqueador
- **Logs:** Histórico de acessos para debug

### Estrutura de Dados
```javascript
// Usuários
usuarios: {
  "admin": { senha: "12345", dataCadastro: "2024-01-01" }
}

// Meta atual
meta: {
  nome: "PlayStation 5",
  valor: 4500,
  dataAtivacao: "2024-01-01"
}

// Horas por semana
horasApostando: {
  sem1: 6, sem2: 4, sem3: 5, sem4: 3
}
```

## 🔐 Segurança

### Medidas Implementadas
- Sanitização de todos os inputs do usuário
- Validação de dados no frontend
- Armazenamento local criptografado (AsyncStorage)
- Verificação de autenticação em rotas protegidas
- Logs de acesso para monitoramento

### Limitações
- Dados armazenados apenas localmente
- Sem sincronização em nuvem
- Baseado em confiança do usuário

## 📱 Compatibilidade

### Plataformas Suportadas
- ✅ Android (versão 5.0+)
- ✅ iOS (versão 10.0+)
- ✅ Expo Go
- ⚠️ Web (funcionalidade limitada)

### Dispositivos Testados
- Android: Emulador Android Studio
- iOS: Simulador Xcode
- Dispositivos físicos via Expo Go

## 🚧 Limitações Conhecidas

1. **Bloqueador de Apps:** Funcionalidade simulada (não bloqueia apps reais)
2. **Dados Offline:** Informações não sincronizam entre dispositivos
3. **Backup:** Sem sistema de backup automático
4. **Notificações:** Não implementadas push notifications

## 🔄 Possíveis Melhorias Futuras

### Funcionalidades
- [ ] Integração com APIs de bancos para monitoramento real
- [ ] Sistema de notificações push
- [ ] Backup em nuvem
- [ ] Relatórios avançados em PDF
- [ ] Integração com suporte psicológico
- [ ] Gamificação com conquistas
- [ ] Modo família para controle parental

### Técnicas
- [ ] Testes unitários e de integração
- [ ] CI/CD pipeline
- [ ] Análise de performance
- [ ] Acessibilidade aprimorada
- [ ] Internacionalização (i18n)

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do curso de Desenvolvimento Mobile.

---
