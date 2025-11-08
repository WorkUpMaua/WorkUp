import 'dart:io';
import 'package:flutter/material.dart';
import '../models/listing.dart';
import '../services/workup_api.dart';
import '../utils/user_storage.dart';
import '../widgets/side_bar.dart';

class TelaPropriedadePage extends StatefulWidget {
  const TelaPropriedadePage({Key? key}) : super(key: key);

  @override
  State<TelaPropriedadePage> createState() => _TelaPropriedadePageState();
}

class _TelaPropriedadePageState extends State<TelaPropriedadePage> {
  final WorkupApi _api = WorkupApi();
  List<Listing> _properties = [];
  bool _isLoading = true;
  String? _errorMessage;
  bool _sidebarActive = false;

  @override
  void initState() {
    super.initState();
    _loadUserProperties();
  }

  Future<void> _loadUserProperties() async {
    final userId = UserStorage().userId;
    if (userId == null) {
      setState(() {
        _errorMessage = "Faça login para gerenciar suas propriedades.";
        _isLoading = false;
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final properties = await _api.fetchUserProperties(userId);
      UserStorage().cacheOwnedProperties(properties);
      if (!mounted) return;
      setState(() {
        _properties = properties;
      });
    } on ApiException catch (err) {
      if (!mounted) return;
      setState(() {
        _errorMessage = err.message;
      });
    } catch (err) {
      if (!mounted) return;
      setState(() {
        _errorMessage = "Erro ao carregar as propriedades: $err";
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _handleDeleteProperty(String propertyId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remover Propriedade'),
        content: const Text(
          'Tem certeza que deseja remover esta propriedade? Esta ação não pode ser desfeita.',
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancelar', style: TextStyle(color: Colors.grey)),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              final userId = UserStorage().userId;
              if (userId == null) return;
              try {
                await _api.deleteCatalogo(propertyId, userId);
                if (!mounted) return;
                await _loadUserProperties();
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Propriedade removida com sucesso'),
                    backgroundColor: Colors.green,
                    duration: Duration(seconds: 2),
                  ),
                );
              } on ApiException catch (err) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(err.message),
                    backgroundColor: Colors.red,
                  ),
                );
              } catch (err) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Erro ao remover propriedade: $err'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: const Text(
              'Remover',
              style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertyCard(Listing property) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 5,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Imagem
          Stack(
            children: [
              if (property.pictures.isNotEmpty)
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                  ),
                  child: _buildPropertyImage(property.pictures.first),
                ),

              // Badge indicando que é sua propriedade
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green.shade100,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.green, width: 1.5),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.verified, size: 14, color: Colors.green),
                      SizedBox(width: 4),
                      Text(
                        'Sua Propriedade',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Conteúdo
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Nome
                Text(
                  property.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),

                // Endereço
                Text(
                  property.address,
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
                const SizedBox(height: 8),

                // Preço
                Text(
                  "R\$ ${property.price.toStringAsFixed(2)} / hora",
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF34495E),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),

                // Capacidade
                Row(
                  children: [
                    const Icon(Icons.people, size: 18, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(
                      "${property.capacity} pessoas",
                      style: const TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                  ],
                ),

                // Comodidades
                if (property.comodities.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: property.comodities.take(4).map((comodity) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.blue[200]!),
                        ),
                        child: Text(
                          comodity,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.blue[800],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],

                // Botão de remover
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => _handleDeleteProperty(property.id),
                    icon: const Icon(Icons.delete_outline, size: 18),
                    label: const Text('Remover Propriedade'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Método para construir a imagem (local ou da internet)
  Widget _buildPropertyImage(String imagePath) {
    // Verifica se é uma URL (começa com http)
    if (imagePath.startsWith('http')) {
      return Image.network(
        imagePath,
        width: double.infinity,
        height: 180,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            height: 180,
            color: Colors.grey[300],
            child: const Icon(
              Icons.photo_outlined,
              size: 50,
              color: Colors.grey,
            ),
          );
        },
      );
    } else {
      // É um arquivo local - verifica se o arquivo existe
      final file = File(imagePath);
      return FutureBuilder<bool>(
        future: file.exists(),
        builder: (context, snapshot) {
          if (snapshot.hasData && snapshot.data == true) {
            return Image.file(
              file,
              width: double.infinity,
              height: 180,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 180,
                  color: Colors.grey[300],
                  child: const Icon(
                    Icons.photo_outlined,
                    size: 50,
                    color: Colors.grey,
                  ),
                );
              },
            );
          } else {
            // Arquivo não existe ou ainda carregando
            return Container(
              height: 180,
              color: Colors.grey[300],
              child: snapshot.connectionState == ConnectionState.waiting
                  ? const Center(child: CircularProgressIndicator())
                  : const Icon(
                      Icons.photo_outlined,
                      size: 50,
                      color: Colors.grey,
                    ),
            );
          }
        },
      );
    }
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
          body: _isLoading
              ? const Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Color(0xFF34495E),
                    ),
                  ),
                )
              : _errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: Colors.red[300],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _errorMessage!,
                        style: const TextStyle(fontSize: 16, color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView(
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
                            Text(
                              "Suas Propriedades",
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2C3E50),
                              ),
                              textAlign: TextAlign.center,
                            ),
                            SizedBox(height: 8),
                            Text(
                              "Gerencie seus espaços cadastrados",
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),

                      // Lista de propriedades
                      _properties.isEmpty
                          ? Padding(
                              padding: const EdgeInsets.all(48),
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.business_outlined,
                                    size: 64,
                                    color: Colors.grey[400],
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    "Você ainda não possui propriedades cadastradas.",
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: Colors.grey,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    "Crie sua primeira propriedade para começar!",
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            )
                          : ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              itemCount: _properties.length,
                              itemBuilder: (context, index) {
                                return _buildPropertyCard(_properties[index]);
                              },
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
