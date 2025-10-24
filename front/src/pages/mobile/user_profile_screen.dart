import 'package:flutter/material.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({Key? key}) : super(key: key);

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class FormData {
  String name;
  String email;
  String cpf;
  String birth;
  String phone;

  FormData({
    required this.name,
    required this.email,
    required this.cpf,
    required this.birth,
    required this.phone,
  });

  FormData copyWith({
    String? name,
    String? email,
    String? cpf,
    String? birth,
    String? phone,
  }) {
    return FormData(
      name: name ?? this.name,
      email: email ?? this.email,
      cpf: cpf ?? this.cpf,
      birth: birth ?? this.birth,
      phone: phone ?? this.phone,
    );
  }
}

class ProfilePersonalInfo extends StatelessWidget {
  final FormData formData;
  final bool isEditing;
  final Function(String, String) onChanged;

  const ProfilePersonalInfo({
    Key? key,
    required this.formData,
    required this.isEditing,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Nome
        _buildFormField(
          label: 'Nome',
          value: formData.name,
          fieldName: 'name',
          isEditing: isEditing,
          onChanged: onChanged,
        ),
        const SizedBox(height: 20),

        // Email
        _buildFormField(
          label: 'Email',
          value: formData.email,
          fieldName: 'email',
          isEditing: isEditing,
          onChanged: onChanged,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 20),

        // CPF
        _buildFormField(
          label: 'CPF',
          value: formData.cpf,
          fieldName: 'cpf',
          isEditing: isEditing,
          onChanged: onChanged,
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 20),

        // Data de Nascimento
        _buildDateField(
          label: 'Data de Nascimento',
          value: formData.birth,
          fieldName: 'birth',
          isEditing: isEditing,
          onChanged: onChanged,
        ),
        const SizedBox(height: 20),

        // Telefone
        _buildFormField(
          label: 'Telefone',
          value: formData.phone,
          fieldName: 'phone',
          isEditing: isEditing,
          onChanged: onChanged,
          keyboardType: TextInputType.phone,
        ),
      ],
    );
  }

  Widget _buildFormField({
    required String label,
    required String value,
    required String fieldName,
    required bool isEditing,
    required Function(String, String) onChanged,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 4),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(8),
          ),
          child: TextFormField(
            initialValue: value,
            enabled: isEditing,
            keyboardType: keyboardType,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              border: InputBorder.none,
            ),
            onChanged: (newValue) => onChanged(fieldName, newValue),
          ),
        ),
      ],
    );
  }

  Widget _buildDateField({
    required String label,
    required String value,
    required String fieldName,
    required bool isEditing,
    required Function(String, String) onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 4),
        GestureDetector(
          onTap: isEditing
              ? () async {
                  final selectedDate = await showDatePicker(
                    context: context,
                    initialDate: value.isNotEmpty ? DateTime.parse(value) : DateTime.now(),
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (selectedDate != null) {
                    onChanged(fieldName, selectedDate.toIso8601String().split('T')[0]);
                  }
                }
              : null,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
              color: isEditing ? Colors.white : Colors.grey.shade100,
            ),
            child: Text(
              value.isNotEmpty 
                  ? _formatDate(value)
                  : 'Selecione uma data',
              style: TextStyle(
                fontSize: 16,
                color: value.isNotEmpty ? Colors.black : Colors.grey,
              ),
            ),
          ),
        ),
      ],
    );
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateString;
    }
  }
}

class _UserProfilePageState extends State<UserProfilePage> {
  final FormData _formData = FormData(
    name: '',
    email: '',
    cpf: '',
    birth: '',
    phone: '',
  );
  final FormData _reliableUser = FormData(
    name: '',
    email: '',
    cpf: '',
    birth: '',
    phone: '',
  );
  
  bool _isEditing = false;
  bool _isLoading = true;
  String? _alertMessage;
  bool _isError = false;

  Map<String, String> _getModifiedFields(FormData prev, FormData curr) {
    final modified = <String, String>{};

    if (curr.name != prev.name) modified['name'] = curr.name;
    if (curr.email != prev.email) modified['email'] = curr.email;
    if (curr.cpf != prev.cpf) modified['cpf'] = curr.cpf;
    if (curr.birth != prev.birth) modified['birth'] = curr.birth;
    if (curr.phone != prev.phone) modified['phone'] = curr.phone;

    return modified;
  }

  void _handleFieldChange(String fieldName, String value) {
    setState(() {
      switch (fieldName) {
        case 'name':
          _formData.name = value;
          break;
        case 'email':
          _formData.email = value;
          break;
        case 'cpf':
          _formData.cpf = value;
          break;
        case 'birth':
          _formData.birth = value;
          break;
        case 'phone':
          _formData.phone = value;
          break;
      }
    });
  }

  Future<void> _handleSubmit() async {
    final fieldsToSend = _getModifiedFields(_reliableUser, _formData);

    // Transforma data para timestamp (simulação)
    if (fieldsToSend.containsKey('birth') && fieldsToSend['birth']!.isNotEmpty) {
      final timestamp = DateTime.parse(fieldsToSend['birth']!).millisecondsSinceEpoch;
      fieldsToSend['birth'] = timestamp.toString();
    }

    setState(() {
      _isLoading = true;
    });

    // Simulação da chamada API
    await Future.delayed(const Duration(seconds: 2));

    try {
      // Simulação de sucesso
      final updatedUserData = FormData(
        name: _formData.name,
        email: _formData.email,
        cpf: _formData.cpf,
        birth: _formData.birth,
        phone: _formData.phone,
      );

      setState(() {
        _reliableUser
          ..name = updatedUserData.name
          ..email = updatedUserData.email
          ..cpf = updatedUserData.cpf
          ..birth = updatedUserData.birth
          ..phone = updatedUserData.phone;
        
        _formData
          ..name = updatedUserData.name
          ..email = updatedUserData.email
          ..cpf = updatedUserData.cpf
          ..birth = updatedUserData.birth
          ..phone = updatedUserData.phone;

        _alertMessage = "Perfil atualizado com sucesso!";
        _isError = false;
        _isEditing = false;
        _isLoading = false;
      });

      // Esconde o alerta após 3 segundos
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            _alertMessage = null;
          });
        }
      });
    } catch (err) {
      setState(() {
        _alertMessage = "ERRO: Falha ao atualizar perfil";
        _isError = true;
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchUser() async {
    // Simulação de carregamento de dados do usuário
    await Future.delayed(const Duration(seconds: 1));

    final mockUserData = FormData(
      name: "João Silva",
      email: "joao.silva@email.com",
      cpf: "123.456.789-00",
      birth: "1990-05-15",
      phone: "(11) 99999-9999",
    );

    setState(() {
      _reliableUser
        ..name = mockUserData.name
        ..email = mockUserData.email
        ..cpf = mockUserData.cpf
        ..birth = mockUserData.birth
        ..phone = mockUserData.phone;
      
      _formData
        ..name = mockUserData.name
        ..email = mockUserData.email
        ..cpf = mockUserData.cpf
        ..birth = mockUserData.birth
        ..phone = mockUserData.phone;
      
      _isLoading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    _fetchUser();
  }

  void _showAlert(String message, {bool error = false}) {
    setState(() {
      _alertMessage = message;
      _isError = error;
    });
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() => _alertMessage = null);
    });
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF34495E);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text("Perfil do Usuário"),
        backgroundColor: primaryColor,
        centerTitle: true,
        elevation: 3,
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF34495E)),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  if (_alertMessage != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: _isError ? Colors.red[100] : Colors.green[100],
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            _isError ? Icons.error_outline : Icons.check_circle_outline,
                            color: _isError ? Colors.red : Colors.green,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _alertMessage!,
                              style: TextStyle(
                                color: _isError ? Colors.red[900] : Colors.green[900],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 6,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Header
                        Container(
                          padding: const EdgeInsets.all(32),
                          decoration: const BoxDecoration(
                            border: Border(
                              bottom: BorderSide(color: Colors.grey, width: 1),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                "Perfil do Usuário",
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2C3E50),
                                ),
                              ),
                              ElevatedButton(
                                onPressed: () {
                                  setState(() {
                                    if (_isEditing) {
                                      // Cancela edição - restaura dados originais
                                      _formData
                                        ..name = _reliableUser.name
                                        ..email = _reliableUser.email
                                        ..cpf = _reliableUser.cpf
                                        ..birth = _reliableUser.birth
                                        ..phone = _reliableUser.phone;
                                    }
                                    _isEditing = !_isEditing;
                                  });
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: primaryColor,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                child: Text(
                                  _isEditing ? "Cancelar" : "Editar Perfil",
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Formulário
                        Padding(
                          padding: const EdgeInsets.all(32),
                          child: Column(
                            children: [
                              ProfilePersonalInfo(
                                formData: _formData,
                                isEditing: _isEditing,
                                onChanged: _handleFieldChange,
                              ),
                              if (_isEditing) ...[
                                const SizedBox(height: 32),
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: _isLoading ? null : _handleSubmit,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: primaryColor,
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    child: _isLoading
                                        ? const SizedBox(
                                            height: 20,
                                            width: 20,
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                              color: Colors.white,
                                            ),
                                          )
                                        : const Text(
                                            "Salvar Alterações",
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w500,
                                              color: Colors.white,
                                            ),
                                          ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}