import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _cpfController = TextEditingController();
  final _birthdateController = TextEditingController();
  final _phoneController = TextEditingController();

  final _cpfMask = MaskTextInputFormatter(mask: '###.###.###-##', filter: {"#": RegExp(r'[0-9]')});
  final _phoneMask = MaskTextInputFormatter(mask: '(##) #####-####', filter: {"#": RegExp(r'[0-9]')});

  bool _isSubmitting = false;
  String? _apiMessage;
  bool _isError = false;

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _apiMessage = null;
    });

    try {
      // Simula a chamada à API
      await Future.delayed(const Duration(seconds: 1));

      setState(() {
        _apiMessage = "Cadastro efetuado!";
        _isError = false;
      });

      // Aqui você pode usar o Navigator para ir para a tela de login:
      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    } catch (e) {
      setState(() {
        _apiMessage = "ERRO: Falha ao cadastrar";
        _isError = true;
      });
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF34495E);

    return Scaffold(
      appBar: AppBar(
      backgroundColor: primaryColor,
      automaticallyImplyLeading: false,
      toolbarHeight: 64,
      flexibleSpace: Center(
        child: Image.asset(
        'assets/logo_WorkUp.png',
        width: 64,
        height: 64,
      ),
    ),
  ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        child: Column(
          children: [
            if (_apiMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _isError ? Colors.red[100] : Colors.green[100],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _isError ? Icons.error_outline : Icons.check_circle_outline,
                      color: _isError ? Colors.red : Colors.green,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _apiMessage!,
                        style: TextStyle(
                          color: _isError ? Colors.red[900] : Colors.green[900],
                          fontWeight: FontWeight.w500,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    const Text(
                      "Cadastro",
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Nome
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: "Nome",
                        border: OutlineInputBorder(),
                        hintText: "Seu nome completo",
                      ),
                      validator: (value) =>
                          value == null || value.isEmpty ? "Campo obrigatório" : null,
                    ),
                    const SizedBox(height: 16),

                    // E-mail
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: "E-mail",
                        border: OutlineInputBorder(),
                        hintText: "exemplo@email.com",
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) =>
                          value == null || !value.contains('@') ? "E-mail inválido" : null,
                    ),
                    const SizedBox(height: 16),

                    // Senha
                    TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: "Senha",
                        border: OutlineInputBorder(),
                        hintText: "Digite sua senha",
                      ),
                      validator: (value) =>
                          value == null || value.length < 6 ? "Mínimo 6 caracteres" : null,
                    ),
                    const SizedBox(height: 16),

                    // CPF
                    TextFormField(
                      controller: _cpfController,
                      inputFormatters: [_cpfMask],
                      decoration: const InputDecoration(
                        labelText: "CPF",
                        border: OutlineInputBorder(),
                        hintText: "000.000.000-00",
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) =>
                          value == null || value.isEmpty ? "Campo obrigatório" : null,
                    ),
                    const SizedBox(height: 16),

                    // Data de nascimento
                    TextFormField(
                      controller: _birthdateController,
                      readOnly: true,
                      decoration: const InputDecoration(
                        labelText: "Data de Nascimento",
                        border: OutlineInputBorder(),
                      ),
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: DateTime(2000),
                          firstDate: DateTime(1900),
                          lastDate: DateTime.now(),
                        );
                        if (date != null) {
                          _birthdateController.text =
                              DateFormat('dd/MM/yyyy').format(date);
                        }
                      },
                      validator: (value) =>
                          value == null || value.isEmpty ? "Campo obrigatório" : null,
                    ),
                    const SizedBox(height: 16),

                    // Telefone
                    TextFormField(
                      controller: _phoneController,
                      inputFormatters: [_phoneMask],
                      decoration: const InputDecoration(
                        labelText: "Telefone",
                        border: OutlineInputBorder(),
                        hintText: "(00) 00000-0000",
                      ),
                      keyboardType: TextInputType.phone,
                      validator: (value) =>
                          value == null || value.isEmpty ? "Campo obrigatório" : null,
                    ),
                    const SizedBox(height: 24),

                    // Botão de cadastro
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _handleSubmit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryColor,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: _isSubmitting
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text(
                                "Cadastrar",
                                style: TextStyle(fontSize: 16, color: Colors.white),
                              ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Ir para login
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/login'),
                      child: Text(
                        "Já tem uma conta? Faça login",
                        style: TextStyle(color: primaryColor, fontSize: 15),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
