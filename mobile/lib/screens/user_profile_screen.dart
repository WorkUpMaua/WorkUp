import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import '../models/user_profile.dart';
import '../services/workup_api.dart';
import '../utils/profile_image_manager.dart';
import '../utils/user_storage.dart';
import '../widgets/custom_button.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({super.key});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  bool _isEditing = false;
  final ImagePicker _picker = ImagePicker();
  final WorkupApi _api = WorkupApi();

  // Controllers para os campos editáveis
  final _nameController = TextEditingController();
  final _birthController = TextEditingController();
  final _phoneController = TextEditingController();

  // Dados fixos do usuário
  String _email = '';
  String _cpf = '';
  bool _isSaving = false;
  UserProfile? _profile;
  final DateFormat _birthFormat = DateFormat('dd/MM/yyyy');

  final Color primaryColor = const Color(0xFF34495E);

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _birthController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _loadUserData() {
    final user = UserStorage().loggedUser;
    if (user == null) return;
    _applyProfile(user);
  }

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        final File file = File(image.path);
        ProfileImageManager().setProfileImage(file);
        setState(() {}); // Atualiza a UI
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

  DateTime? _parseBirthInput() {
    final raw = _birthController.text.trim();
    if (raw.isEmpty) return null;
    try {
      return _birthFormat.parseStrict(raw);
    } catch (_) {
      return null;
    }
  }

  Future<void> _handleSave() async {
    final user = _profile;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Nenhum usuário autenticado'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final birthDate = _parseBirthInput() ?? user.birthDate;
    final phone = _phoneController.text.trim();

    if (birthDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Informe uma data de nascimento válida.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (phone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Informe um telefone válido.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isSaving = true);
    try {
      final updated = await _api.updateUserProfile(
        id: user.id,
        name: _nameController.text.trim(),
        birthDate: birthDate,
        phone: phone,
        cpf: user.cpf,
      );
      UserStorage().updateLoggedUser(updated);
      if (!mounted) return;
      _applyProfile(updated, exitEditMode: true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Informações atualizadas com sucesso!"),
          backgroundColor: Colors.green,
        ),
      );
    } on ApiException catch (err) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(err.message), backgroundColor: Colors.red),
      );
    } catch (err) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao atualizar informações: $err'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  void _applyProfile(UserProfile profile, {bool exitEditMode = false}) {
    setState(() {
      _profile = profile;
      _nameController.text = profile.name;
      _email = profile.email;
      _cpf = profile.cpf;
      _phoneController.text = profile.phone;
      _birthController.text = profile.formattedBirth();
      if (exitEditMode) {
        _isEditing = false;
      }
    });
  }

  void _handleCancel() {
    setState(() {
      _isEditing = false;
      _loadUserData(); // Recarrega os dados originais
    });
  }

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
                      if (_isEditing) {
                        _handleCancel();
                      } else {
                        setState(() {
                          _isEditing = true;
                        });
                      }
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
            _buildEditableTextField(
              "Nome",
              Icons.person,
              _nameController,
              canEdit: true,
            ),
            _buildFixedTextField("Email", Icons.email, _email),
            _buildFixedTextField("CPF", Icons.badge, _cpf),
            _buildEditableTextField(
              "Data de Nascimento",
              Icons.cake,
              _birthController,
              canEdit: true,
              readOnly: true,
              onTap: () async {
                final current = _parseBirthInput() ?? DateTime(2000);
                final selected = await showDatePicker(
                  context: context,
                  initialDate: current,
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                );
                if (selected != null) {
                  _birthController.text = _birthFormat.format(selected);
                }
              },
            ),
            _buildEditableTextField(
              "Telefone",
              Icons.phone,
              _phoneController,
              canEdit: true,
              keyboardType: TextInputType.phone,
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[0-9()+\-\s]')),
              ],
            ),

            const SizedBox(height: 30),

            // Botão de salvar
            if (_isEditing)
              CustomButton(
                text: "Salvar Alterações",
                onPressed: _isSaving ? null : _handleSave,
                backgroundColor: primaryColor,
                isLoading: _isSaving,
              ),
          ],
        ),
      ),
    );
  }

  // Campo de texto editável
  Widget _buildEditableTextField(
    String label,
    IconData icon,
    TextEditingController controller, {
    required bool canEdit,
    VoidCallback? onTap,
    bool readOnly = false,
    TextInputType keyboardType = TextInputType.text,
    List<TextInputFormatter>? inputFormatters,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        readOnly: readOnly || (onTap != null && !_isEditing),
        enabled: _isEditing && canEdit,
        onTap: (_isEditing && canEdit && onTap != null) ? onTap : null,
        controller: controller,
        keyboardType: keyboardType,
        inputFormatters: inputFormatters,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon),
          filled: true,
          fillColor: (_isEditing && canEdit) ? Colors.white : Colors.grey[100],
          enabledBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.transparent),
            borderRadius: BorderRadius.circular(10),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: primaryColor, width: 1.5),
            borderRadius: BorderRadius.circular(10),
          ),
          disabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
    );
  }

  // Campo de texto fixo (não editável)
  Widget _buildFixedTextField(String label, IconData icon, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        key: ValueKey('$label-$value'),
        enabled: false,
        initialValue: value,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon),
          filled: true,
          fillColor: Colors.grey[100],
          disabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(10),
          ),
          suffixIcon: const Tooltip(
            message: 'Este campo não pode ser editado',
            child: Icon(Icons.lock_outline, color: Colors.grey),
          ),
        ),
      ),
    );
  }
}
