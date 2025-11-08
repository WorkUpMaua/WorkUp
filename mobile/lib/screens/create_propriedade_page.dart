import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';

import '../services/workup_api.dart';
import '../utils/user_storage.dart';
import '../widgets/alert_widget.dart';
import '../widgets/commodities_selector.dart';
import '../widgets/side_bar.dart';
import 'properties_screen.dart';

class CreatePropriedadePage extends StatefulWidget {
  const CreatePropriedadePage({Key? key}) : super(key: key);

  @override
  State<CreatePropriedadePage> createState() => _CreatePropriedadePageState();
}

class _CreatePropriedadePageState extends State<CreatePropriedadePage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _addressController = TextEditingController();
  final _capacityController = TextEditingController();
  final _serialPortaController = TextEditingController();

  List<String> _comodidades = [];
  final List<_SelectedImage> _images = [];
  bool _isSubmitting = false;
  String? _alertMessage;
  bool _isError = false;
  bool _sidebarActive = false;
  final WorkupApi _api = WorkupApi();

  final ImagePicker _picker = ImagePicker();

  // Formatter customizado para preço com vírgula e centavos
  final _priceInputFormatter = TextInputFormatter.withFunction((
    oldValue,
    newValue,
  ) {
    String text = newValue.text;

    // Remove tudo exceto dígitos e vírgula
    String cleaned = text.replaceAll(RegExp(r'[^\d,]'), '');

    // Se está vazio, retorna vazio
    if (cleaned.isEmpty) {
      return const TextEditingValue(
        text: '',
        selection: TextSelection.collapsed(offset: 0),
      );
    }

    // Conta quantas vírgulas existem
    int commaCount = ','.allMatches(cleaned).length;

    // Se tem mais de uma vírgula, remove as extras
    if (commaCount > 1) {
      int firstCommaIndex = cleaned.indexOf(',');
      cleaned =
          cleaned.substring(0, firstCommaIndex + 1) +
          cleaned.substring(firstCommaIndex + 1).replaceAll(',', '');
    }

    // Se tem vírgula, divide em parte inteira e decimal
    if (cleaned.contains(',')) {
      List<String> parts = cleaned.split(',');
      String intPart = parts[0].replaceAll(RegExp(r'[^\d]'), '');
      String decimalPart = parts.length > 1
          ? parts[1].replaceAll(RegExp(r'[^\d]'), '')
          : '';

      // Limita decimais a 2 dígitos
      if (decimalPart.length > 2) {
        decimalPart = decimalPart.substring(0, 2);
      }

      // Limita parte inteira a 7 dígitos (9.999.999)
      if (intPart.length > 7) {
        intPart = intPart.substring(0, 7);
      }

      // Adiciona pontos de milhar na parte inteira
      String formattedIntPart = '';
      int count = 0;
      for (int i = intPart.length - 1; i >= 0; i--) {
        if (count == 3) {
          formattedIntPart = '.$formattedIntPart';
          count = 0;
        }
        formattedIntPart = intPart[i] + formattedIntPart;
        count++;
      }

      if (formattedIntPart.isEmpty) formattedIntPart = '0';

      String formatted = '$formattedIntPart,$decimalPart';

      return TextEditingValue(
        text: formatted,
        selection: TextSelection.collapsed(offset: formatted.length),
      );
    } else {
      // Não tem vírgula ainda, formata apenas a parte inteira
      String intPart = cleaned.replaceAll(RegExp(r'[^\d]'), '');

      // Limita parte inteira a 7 dígitos
      if (intPart.length > 7) {
        intPart = intPart.substring(0, 7);
      }

      // Adiciona pontos de milhar
      String formattedIntPart = '';
      int count = 0;
      for (int i = intPart.length - 1; i >= 0; i--) {
        if (count == 3) {
          formattedIntPart = '.$formattedIntPart';
          count = 0;
        }
        formattedIntPart = intPart[i] + formattedIntPart;
        count++;
      }

      return TextEditingValue(
        text: formattedIntPart,
        selection: TextSelection.collapsed(offset: formattedIntPart.length),
      );
    }
  });

  double parseMoney(String str) {
    if (str.isEmpty) return 0.0;
    final normalized = str.replaceAll('.', '').replaceAll(',', '.');
    return double.tryParse(normalized) ?? 0.0;
  }

  Future<void> _pickImages() async {
    try {
      final picked = await _picker.pickMultiImage();
      if (picked != null && picked.isNotEmpty) {
        final futures = picked.map((file) async {
          final bytes = await file.readAsBytes();
          return _SelectedImage(file: file, bytes: bytes);
        }).toList();
        final newImages = await Future.wait(futures);
        if (mounted) {
          setState(() => _images.addAll(newImages));
        }
      }
    } catch (e) {
      print('Erro ao selecionar imagens: $e');
    }
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
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _addressController.dispose();
    _capacityController.dispose();
    _serialPortaController.dispose();
    super.dispose();
  }

  bool _validateForm() {
    if (_nameController.text.isEmpty) {
      _showAlert("Nome da sala é obrigatório", error: true);
      return false;
    }
    if (_descriptionController.text.isEmpty) {
      _showAlert("Descrição é obrigatória", error: true);
      return false;
    }
    if (_priceController.text.isEmpty ||
        parseMoney(_priceController.text) <= 0) {
      _showAlert("Preço deve ser maior que zero", error: true);
      return false;
    }
    if (_addressController.text.isEmpty) {
      _showAlert("Endereço é obrigatório", error: true);
      return false;
    }
    if (_capacityController.text.isEmpty ||
        int.tryParse(_capacityController.text) == null ||
        int.parse(_capacityController.text) < 1) {
      _showAlert("Capacidade válida é obrigatória", error: true);
      return false;
    }
    if (_serialPortaController.text.isEmpty) {
      _showAlert("Serial da porta é obrigatório", error: true);
      return false;
    }
    if (_images.isEmpty) {
      _showAlert("Envie ao menos uma foto", error: true);
      return false;
    }
    return true;
  }

  Future<void> _handleSubmit() async {
    if (!_validateForm()) return;

    setState(() => _isSubmitting = true);

    try {
      final userId = UserStorage().userId;
      if (userId == null) {
        _showAlert(
          "Você precisa estar autenticado para cadastrar um espaço.",
          error: true,
        );
        return;
      }

      await _api.createCatalogo(
        userId: userId,
        name: _nameController.text.trim(),
        description: _descriptionController.text.trim(),
        address: _addressController.text.trim(),
        comodities: _comodidades,
        price: parseMoney(_priceController.text),
        capacity: int.parse(_capacityController.text),
        doorSerial: _serialPortaController.text.trim(),
        pictures: List.of(_images),
      );

      if (!mounted) return;
      setState(() {
        _alertMessage = "Sala criada com sucesso!";
        _isError = false;
      });

      await Future.delayed(const Duration(milliseconds: 600));

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const TelaPropriedadePage()),
        );
      }
    } on ApiException catch (err) {
      _showAlert(err.message, error: true);
    } catch (e) {
      _showAlert("Erro ao criar sala: $e", error: true);
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String labelText,
    String? hintText,
    TextInputType keyboardType = TextInputType.text,
    List<TextInputFormatter>? inputFormatters,
    String? Function(String?)? validator,
    InputDecoration? decoration,
  }) {
    return TextFormField(
      controller: controller,
      decoration:
          decoration ??
          InputDecoration(
            labelText: labelText,
            hintText: hintText,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            filled: true,
            fillColor: Colors.grey[50],
          ),
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      validator: validator,
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF34495E);

    return Stack(
      children: [
        Scaffold(
          backgroundColor: Colors.grey[100],
          appBar: AppBar(
            backgroundColor: primaryColor,
            leading: IconButton(
              icon: const Icon(Icons.menu, color: Colors.white),
              onPressed: () => setState(() => _sidebarActive = true),
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
            child: Column(
              children: [
                // Header com título
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Column(
                    children: [
                      Icon(
                        Icons.add_business,
                        size: 48,
                        color: Color(0xFF34495E),
                      ),
                      SizedBox(height: 12),
                      Text(
                        "Criar Nova Propriedade",
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2C3E50),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 8),
                      Text(
                        "Cadastre seu espaço e comece a alugar",
                        style: TextStyle(fontSize: 14, color: Colors.grey),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),

                // Formulário
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
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
                        padding: const EdgeInsets.all(20),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "Informações Básicas",
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2C3E50),
                                ),
                              ),
                              const SizedBox(height: 20),

                              _buildTextField(
                                controller: _nameController,
                                labelText: "Nome da Sala",
                                hintText: "Ex: Sala de Reunião Executive",
                              ),
                              const SizedBox(height: 16),

                              _buildTextField(
                                controller: _descriptionController,
                                labelText: "Descrição",
                                hintText: "Conte mais sobre o espaço",
                                keyboardType: TextInputType.multiline,
                              ),
                              const SizedBox(height: 16),

                              TextFormField(
                                controller: _priceController,
                                keyboardType:
                                    const TextInputType.numberWithOptions(
                                      decimal: true,
                                    ),
                                inputFormatters: [_priceInputFormatter],
                                decoration: InputDecoration(
                                  labelText: "Preço por hora",
                                  hintText: "150,00",
                                  prefixText: "R\$ ",
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[50],
                                ),
                              ),
                              const SizedBox(height: 16),

                              _buildTextField(
                                controller: _addressController,
                                labelText: "Endereço",
                                hintText:
                                    "Ex: Av. Paulista, 1000 - São Paulo/SP",
                              ),
                              const SizedBox(height: 16),

                              Row(
                                children: [
                                  Expanded(
                                    child: _buildTextField(
                                      controller: _capacityController,
                                      labelText: "Capacidade",
                                      hintText: "Pessoas",
                                      keyboardType: TextInputType.number,
                                      inputFormatters: [
                                        FilteringTextInputFormatter.digitsOnly,
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _buildTextField(
                                      controller: _serialPortaController,
                                      labelText: 'Serial da Porta',
                                      hintText: '123456789',
                                      keyboardType: TextInputType.number,
                                      inputFormatters: [
                                        FilteringTextInputFormatter.digitsOnly,
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),

                              // Comodidades
                              const Text(
                                "Comodidades",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF2C3E50),
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                "Selecione as comodidades disponíveis",
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.grey,
                                ),
                              ),
                              const SizedBox(height: 12),
                              CommoditiesSelector(
                                selectedQualities: _comodidades,
                                onChanged: (newList) {
                                  setState(() => _comodidades = newList);
                                },
                              ),
                              const SizedBox(height: 24),

                              // Fotos
                              const Text(
                                "Fotos da Propriedade",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF2C3E50),
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                "Adicione fotos atraentes do seu espaço",
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.grey,
                                ),
                              ),
                              const SizedBox(height: 12),

                              _images.isEmpty
                                  ? GestureDetector(
                                      onTap: _pickImages,
                                      child: Container(
                                        width: double.infinity,
                                        height: 180,
                                        decoration: BoxDecoration(
                                          color: Colors.grey[100],
                                          border: Border.all(
                                            color: Colors.grey.shade300,
                                            width: 2,
                                          ),
                                          borderRadius: BorderRadius.circular(
                                            12,
                                          ),
                                        ),
                                        child: const Center(
                                          child: Column(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              Icon(
                                                Icons.add_a_photo_outlined,
                                                size: 48,
                                                color: Colors.grey,
                                              ),
                                              SizedBox(height: 12),
                                              Text(
                                                "Clique para adicionar fotos",
                                                style: TextStyle(
                                                  color: Colors.grey,
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    )
                                  : Column(
                                      children: [
                                        GridView.builder(
                                          shrinkWrap: true,
                                          physics:
                                              const NeverScrollableScrollPhysics(),
                                          gridDelegate:
                                              const SliverGridDelegateWithFixedCrossAxisCount(
                                                crossAxisCount: 3,
                                                crossAxisSpacing: 8,
                                                mainAxisSpacing: 8,
                                              ),
                                          itemCount: _images.length,
                                          itemBuilder: (context, index) {
                                            return Stack(
                                              children: [
                                                ClipRRect(
                                                  borderRadius:
                                                      BorderRadius.circular(8),
                                                  child: Image.memory(
                                                    _images[index].bytes,
                                                    fit: BoxFit.cover,
                                                    width: double.infinity,
                                                    height: double.infinity,
                                                  ),
                                                ),
                                                Positioned(
                                                  right: 4,
                                                  top: 4,
                                                  child: GestureDetector(
                                                    onTap: () {
                                                      setState(
                                                        () => _images.removeAt(
                                                          index,
                                                        ),
                                                      );
                                                    },
                                                    child: Container(
                                                      padding:
                                                          const EdgeInsets.all(
                                                            4,
                                                          ),
                                                      decoration: BoxDecoration(
                                                        color: Colors.black54,
                                                        borderRadius:
                                                            BorderRadius.circular(
                                                              20,
                                                            ),
                                                      ),
                                                      child: const Icon(
                                                        Icons.close,
                                                        color: Colors.white,
                                                        size: 18,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            );
                                          },
                                        ),
                                        const SizedBox(height: 12),
                                        OutlinedButton.icon(
                                          onPressed: _pickImages,
                                          icon: const Icon(
                                            Icons.add_photo_alternate,
                                          ),
                                          label: const Text(
                                            "Adicionar mais fotos",
                                          ),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: primaryColor,
                                            side: BorderSide(
                                              color: primaryColor,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),

                              const SizedBox(height: 32),

                              // Alerta de confirmação (aparece aqui embaixo)
                              if (_alertMessage != null && !_isError)
                                Container(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.green[100],
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: Colors.green,
                                      width: 1.5,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(
                                        Icons.check_circle_outline,
                                        color: Colors.green,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          _alertMessage!,
                                          style: TextStyle(
                                            color: Colors.green[900],
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                              // Alerta de erro (se houver)
                              if (_alertMessage != null && _isError)
                                Container(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.red[100],
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: Colors.red,
                                      width: 1.5,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(
                                        Icons.error_outline,
                                        color: Colors.red,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          _alertMessage!,
                                          style: TextStyle(
                                            color: Colors.red[900],
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                              // Botão
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: _isSubmitting
                                      ? null
                                      : _handleSubmit,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: primaryColor,
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    elevation: 2,
                                  ),
                                  child: _isSubmitting
                                      ? const SizedBox(
                                          height: 20,
                                          width: 20,
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                            strokeWidth: 2,
                                          ),
                                        )
                                      : const Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Icon(
                                              Icons.check_circle_outline,
                                              color: Colors.white,
                                            ),
                                            SizedBox(width: 8),
                                            Text(
                                              "Criar Propriedade",
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ],
                                        ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        SidebarMenu(
          active: _sidebarActive,
          onClose: () => setState(() => _sidebarActive = false),
        ),
      ],
    );
  }
}

class _SelectedImage {
  final XFile file;
  final Uint8List bytes;

  const _SelectedImage({required this.file, required this.bytes});
}
