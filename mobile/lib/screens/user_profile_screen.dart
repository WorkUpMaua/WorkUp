import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../widgets/custom_button.dart';
import '../utils/profile_image_manager.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({super.key});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  bool _isEditing = false;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        final File file = File(image.path);
        ProfileImageManager().setProfileImage(file);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Erro ao selecionar imagem'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  final _formData = {
    'name': 'Tiago Tadeu',
    'email': 'tiago@email.com',
    'cpf': '123.456.789-00',
    'birth': '01/01/2000',
    'phone': '(11) 99999-9999',
  };

  final _reliableUser = {
    'name': 'Tiago Tadeu',
    'email': 'tiago@email.com',
    'cpf': '123.456.789-00',
    'birth': '01/01/2000',
    'phone': '(11) 99999-9999',
  };

  final Color primaryColor = const Color(0xFF34495E);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFF34495E),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Image.asset(
          'assets/logo_WorkUp.png',
          height: 40,
          fit: BoxFit.contain,
        ),
        centerTitle: true,
        elevation: 3,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Título da página
            Container(
              margin: const EdgeInsets.only(bottom: 20),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Text(
                      "Perfil do Usuário",
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2C3E50),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        if (_isEditing) {
                          _formData
                            ..['name'] = _reliableUser['name'] as String
                            ..['email'] = _reliableUser['email'] as String
                            ..['cpf'] = _reliableUser['cpf'] as String
                            ..['birth'] = _reliableUser['birth'] as String
                            ..['phone'] = _reliableUser['phone'] as String;
                        }
                        _isEditing = !_isEditing;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      minimumSize: const Size(0, 40),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
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

            // Foto de perfil
            Center(
              child: GestureDetector(
                onTap: _pickImage,
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: Colors.grey[300],
                      child: ProfileImageManager().profileImage != null
                          ? ClipOval(
                              child: Image.file(
                                ProfileImageManager().profileImage!,
                                width: 100,
                                height: 100,
                                fit: BoxFit.cover,
                              ),
                            )
                          : const Icon(
                              Icons.person,
                              size: 50,
                              color: Colors.grey,
                            ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Color(0xFF34495E),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.camera_alt,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Campos de formulário
            _buildTextField("Nome", "name", Icons.person),
            _buildTextField("Email", "email", Icons.email),
            _buildTextField("CPF", "cpf", Icons.badge),
            _buildTextField("Data de Nascimento", "birth", Icons.cake),
            _buildTextField("Telefone", "phone", Icons.phone),

            const SizedBox(height: 30),

            // Botão de salvar
            if (_isEditing)
              CustomButton(
                text: "Salvar Alterações",
                onPressed: () {
                  setState(() {
                    _isEditing = false;
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Informações atualizadas com sucesso!"),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                backgroundColor: primaryColor,
              ),
          ],
        ),
      ),
    );
  }

  // Campo de texto reutilizável
  Widget _buildTextField(String label, String key, IconData icon) {
    // Define quais campos não podem ser editados
    final bool isUneditable = key == 'email' || key == 'cpf' || key == 'phone';

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        enabled: _isEditing && !isUneditable,
        initialValue: _formData[key],
        onChanged: (value) => _formData[key] = value,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon),
          filled: true,
          fillColor: isUneditable ? Colors.grey[100] : Colors.white,
          enabledBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.transparent),
            borderRadius: BorderRadius.circular(10),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: const Color(0xFF34495E), width: 1.5),
            borderRadius: BorderRadius.circular(10),
          ),
          disabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(10),
          ),
          // Adiciona um sufixo para indicar que o campo não pode ser editado
          suffixIcon: isUneditable
              ? const Tooltip(
                  message: 'Este campo não pode ser editado',
                  child: Icon(Icons.lock_outline, color: Colors.grey),
                )
              : null,
        ),
      ),
    );
  }
}
