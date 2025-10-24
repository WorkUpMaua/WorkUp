import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import '../widgets/commodities_selector.dart';
import '../widgets/alert_widget.dart';
import '../widgets/search_bar.dart';
import '../widgets/side_bar.dart';

class CreatePropriedadePage extends StatefulWidget {
  const CreatePropriedadePage({Key? key}) : super(key: key);

  @override
  State<CreatePropriedadePage> createState() => _CreatePropriedadePageState();
}

class _CreatePropriedadePageState extends State<CreatePropriedadePage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _addressController = TextEditingController();
  final _capacityController = TextEditingController();

  List<String> _comodidades = [];
  final List<File> _images = [];
  bool _isSubmitting = false;
  String? _alertMessage;
  bool _isError = false;
  bool _sidebarActive = false;

  final _moneyMask = MaskTextInputFormatter(
    mask: '###.###.###,##',
    filter: {"#": RegExp(r'[0-9]')},
  );

  final ImagePicker _picker = ImagePicker();

  double parseMoney(String str) {
    final normalized = str.replaceAll('.', '').replaceAll(',', '.');
    return double.tryParse(normalized) ?? 0.0;
  }

  Future<void> _pickImages() async {
    final List<XFile>? picked = await _picker.pickMultiImage();
    if (picked != null && picked.isNotEmpty) {
      setState(() {
        _images.addAll(picked.map((x) => File(x.path)).toList());
      });
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

  bool _validateForm() {
    if (_nameController.text.isEmpty) {
      _showAlert("Nome da sala é obrigatório", error: true);
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
    if (_images.isEmpty) {
      _showAlert("Envie ao menos uma foto", error: true);
      return false;
    }
    return true;
  }

  Future<void> _handleSubmit() async {
    if (!_validateForm()) return;

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _isSubmitting = false;
      _showAlert("Sala criada com sucesso!", error: false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF34495E);

    return Stack(
      children: [
        Scaffold(
          backgroundColor: Colors.grey[100],
          appBar: AppBar(
            backgroundColor: const Color(0xFF34495E),
            leading: IconButton(
              icon: const Icon(Icons.menu, color: Colors.white),
              onPressed: () => setState(() => _sidebarActive = true),
            ),
            title: const Text(
              'Criar Nova Sala',
              style: TextStyle(color: Colors.white),
            ),
            centerTitle: true,
            elevation: 3,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                if (_alertMessage != null)
                  AlertWidget(
                    message: _alertMessage!,
                    type: _isError ? 'error' : 'success',
                    onClose: () => setState(() => _alertMessage = null),
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
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        const Text(
                          "Informações da Sala",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Nome
                        TextFormField(
                          controller: _nameController,
                          decoration: const InputDecoration(
                            labelText: "Nome da Sala",
                            hintText: "Ex: Sala de Reunião Executive",
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Preço
                        TextFormField(
                          controller: _priceController,
                          inputFormatters: [_moneyMask],
                          decoration: const InputDecoration(
                            prefixText: "R\$ ",
                            labelText: "Preço por hora",
                            hintText: "0,00",
                            border: OutlineInputBorder(),
                          ),
                          keyboardType: TextInputType.number,
                        ),
                        const SizedBox(height: 16),

                        // Endereço
                        TextFormField(
                          controller: _addressController,
                          decoration: const InputDecoration(
                            labelText: "Endereço",
                            hintText: "Av. Paulista, 1000 - São Paulo/SP",
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Capacidade
                        TextFormField(
                          controller: _capacityController,
                          decoration: const InputDecoration(
                            labelText: "Capacidade",
                            hintText: "Número de pessoas",
                            border: OutlineInputBorder(),
                          ),
                          keyboardType: TextInputType.number,
                        ),
                        const SizedBox(height: 16),

                        // Comodidades
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Comodidades",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 8),
                            CommoditiesSelector(
                              selectedQualities: _comodidades,
                              onChanged: (newList) {
                                setState(() => _comodidades = newList);
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Fotos
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "Fotos da Sala",
                            style: TextStyle(
                              color: Colors.grey[700],
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),

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
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.add_a_photo_outlined,
                                          size: 40,
                                          color: Colors.grey,
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          "Adicionar fotos",
                                          style: TextStyle(
                                            color: Colors.grey,
                                            fontSize: 16,
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
                                          crossAxisSpacing: 6,
                                          mainAxisSpacing: 6,
                                        ),
                                    itemCount: _images.length,
                                    itemBuilder: (context, index) {
                                      return Stack(
                                        children: [
                                          ClipRRect(
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                            child: Image.file(
                                              _images[index],
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
                                                  () => _images.removeAt(index),
                                                );
                                              },
                                              child: Container(
                                                decoration: BoxDecoration(
                                                  color: Colors.black45,
                                                  borderRadius:
                                                      BorderRadius.circular(20),
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
                                  const SizedBox(height: 10),
                                  OutlinedButton.icon(
                                    onPressed: _pickImages,
                                    icon: const Icon(Icons.add_photo_alternate),
                                    label: const Text("Adicionar mais fotos"),
                                  ),
                                ],
                              ),

                        const SizedBox(height: 24),

                        // Botão
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
                                ? const CircularProgressIndicator(
                                    color: Colors.white,
                                  )
                                : const Text(
                                    "Criar Sala",
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.white,
                                    ),
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
        ),
        SidebarMenu(
          active: _sidebarActive,
          onClose: () => setState(() => _sidebarActive = false),
        ),
      ],
    );
  }
}
