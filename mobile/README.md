# WorkUp Mobile App

Aplicativo mobile do WorkUp desenvolvido em Flutter para Android e Web.

## 🚀 Funcionalidades

- **Autenticação**: Login e cadastro de usuários
- **Home**: Listagem de propriedades disponíveis
- **Busca**: Pesquisa por localização
- **Detalhes**: Visualização detalhada das propriedades
- **Perfil**: Gerenciamento do perfil do usuário
- **Responsivo**: Interface otimizada para mobile

## 📱 Telas Implementadas

### 1. Login Screen
- Formulário de login com validação
- Link para cadastro
- Integração com API de autenticação

### 2. Register Screen
- Formulário de cadastro completo
- Validação de campos
- Confirmação de senha

### 3. Home Screen
- Lista de propriedades
- Barra de busca
- Navegação para detalhes
- Menu de perfil e logout

### 4. Property Detail Screen
- Visualização completa da propriedade
- Galeria de imagens
- Informações detalhadas
- Botão de reserva

### 5. Profile Screen
- Visualização e edição do perfil
- Informações da conta
- Atualização de dados

## 🛠 Tecnologias Utilizadas

- **Flutter 3.35.6**: Framework principal
- **Provider**: Gerenciamento de estado
- **HTTP**: Comunicação com API
- **Material Design 3**: Design system

## 📦 Dependências Principais

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  http: ^1.1.0
  provider: ^6.1.1
  go_router: ^14.2.0
  flutter_svg: ^2.0.10+1
  shared_preferences: ^2.2.2
  cached_network_image: ^3.3.1
  form_field_validator: ^1.1.0
```

## 🏗 Estrutura do Projeto

```
lib/
├── main.dart                 # Ponto de entrada da aplicação
├── models/                   # Modelos de dados
│   ├── user.dart
│   ├── property.dart
│   └── booking.dart
├── screens/                   # Telas da aplicação
│   ├── login_screen.dart
│   ├── register_screen.dart
│   ├── home_screen.dart
│   ├── property_detail_screen.dart
│   └── profile_screen.dart
├── widgets/                   # Componentes reutilizáveis
│   ├── custom_text_field.dart
│   ├── custom_button.dart
│   ├── property_card.dart
│   └── search_bar.dart
├── services/                   # Serviços de API
│   ├── user_service.dart
│   └── property_service.dart
├── providers/                 # Gerenciamento de estado
│   └── app_provider.dart
└── utils/                     # Utilitários
```

## 🚀 Como Executar

### Pré-requisitos
- Flutter SDK instalado
- Dart SDK
- Chrome (para web) ou Android Studio (para Android)

### Comandos

1. **Instalar dependências**:
   ```bash
   flutter pub get
   ```

2. **Executar no navegador**:
   ```bash
   flutter run -d chrome --web-port=3001
   ```

3. **Executar no Android** (após configurar Android SDK):
   ```bash
   flutter run -d android
   ```

## 🔧 Configuração da API

O app está configurado para se conectar com a API local na porta 3000. Para alterar:

1. Edite os arquivos em `lib/services/`
2. Modifique a constante `baseUrl`:
   ```dart
   static const String baseUrl = 'http://localhost:3000';
   ```

## 📱 Funcionalidades Futuras

- [ ] Sistema de reservas completo
- [ ] Notificações push
- [ ] Chat com proprietários
- [ ] Avaliações e comentários
- [ ] Favoritos
- [ ] Pagamentos integrados
- [ ] Modo offline

## 🐛 Problemas Conhecidos

- Android SDK não configurado (funciona apenas na web por enquanto)
- Imagens podem não carregar se a API não estiver rodando
- Funcionalidade de reserva ainda não implementada

## 📄 Licença

Este projeto faz parte do WorkUp e está sob a mesma licença do projeto principal.