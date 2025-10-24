import 'package:flutter/material.dart';

class WorkSpacePage extends StatefulWidget {
  final String? id;

  const WorkSpacePage({Key? key, this.id}) : super(key: key);

  @override
  State<WorkSpacePage> createState() => _WorkSpacePageState();
}

class RoomDetails {
  final String id;
  final String name;
  final String address;
  final List<String> comodities;
  final List<String> pictures;
  final double price;
  final int capacity;

  RoomDetails({
    required this.id,
    required this.name,
    required this.address,
    required this.comodities,
    required this.pictures,
    required this.price,
    required this.capacity,
  });

  factory RoomDetails.fromJson(Map<String, dynamic> json) {
    return RoomDetails(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      comodities: List<String>.from(json['comodities'] ?? []),
      pictures: List<String>.from(json['pictures'] ?? []),
      price: (json['price'] ?? 0).toDouble(),
      capacity: json['capacity'] ?? 0,
    );
  }
}

class PhotoGallery extends StatelessWidget {
  final List<String> photos;
  final bool link;

  const PhotoGallery({
    Key? key,
    required this.photos,
    required this.link,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (photos.isEmpty) {
      return Container(
        height: 300,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(
          child: Icon(
            Icons.photo_outlined,
            size: 50,
            color: Colors.grey,
          ),
        ),
      );
    }

    return Column(
      children: [
        // Imagem principal
        Container(
          height: 300,
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              photos.first,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  color: Colors.grey[300],
                  child: const Icon(
                    Icons.photo_outlined,
                    size: 50,
                    color: Colors.grey,
                  ),
                );
              },
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Miniaturas (se houver mais de uma imagem)
        if (photos.length > 1)
          SizedBox(
            height: 80,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: photos.length,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    // Implementar visualização ampliada se necessário
                  },
                  child: Container(
                    width: 80,
                    height: 80,
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        photos[index],
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: Colors.grey[300],
                            child: const Icon(
                              Icons.photo_outlined,
                              size: 30,
                              color: Colors.grey,
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }
}

class BackButton extends StatelessWidget {
  final VoidCallback onPressed;

  const BackButton({Key? key, required this.onPressed}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: const Icon(
          Icons.arrow_back,
          color: Color(0xFF34495E),
          size: 24,
        ),
      ),
    );
  }
}

class AlertWidget extends StatelessWidget {
  final String message;
  final String type;
  final VoidCallback onClose;

  const AlertWidget({
    Key? key,
    required this.message,
    required this.type,
    required this.onClose,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isError = type == 'error';
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isError ? Colors.red[100] : Colors.green[100],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isError ? Colors.red : Colors.green,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Icon(
            isError ? Icons.error_outline : Icons.check_circle_outline,
            color: isError ? Colors.red : Colors.green,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                color: isError ? Colors.red[800] : Colors.green[800],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          IconButton(
            onPressed: onClose,
            icon: const Icon(Icons.close, size: 20),
            color: isError ? Colors.red : Colors.green,
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
        ],
      ),
    );
  }
}

class _WorkSpacePageState extends State<WorkSpacePage> {
  RoomDetails? _room;
  bool _loading = true;
  String? _alertMessage;
  bool _isError = false;

  @override
  void initState() {
    super.initState();
    _fetchRoom();
  }

  Future<void> _fetchRoom() async {
    if (widget.id == null) {
      setState(() {
        _alertMessage = 'ID de sala inválido.';
        _isError = true;
        _loading = false;
      });
      return;
    }

    try {
      // Simulação da chamada API - substitua pela chamada real
      await Future.delayed(const Duration(seconds: 2));

      // Mock data para demonstração
      final mockRoom = RoomDetails(
        id: widget.id!,
        name: 'Sala de Reunião Executive',
        address: 'Av. Paulista, 1000 - São Paulo/SP',
        comodities: ['Wi-Fi', 'Ar-condicionado', 'Projetor', 'Café', 'Estacionamento'],
        pictures: [
          'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
          'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
        ],
        price: 150.00,
        capacity: 10,
      );

      setState(() {
        _room = mockRoom;
        _loading = false;
      });
    } catch (err) {
      setState(() {
        _alertMessage = 'ERRO: Não foi possível carregar detalhes da sala.';
        _isError = true;
        _loading = false;
      });
    }
  }

  void _handleReserve() {
    // Implementar lógica de reserva
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Funcionalidade de reserva em desenvolvimento'),
        backgroundColor: const Color(0xFF34495E),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Botão voltar
              Align(
                alignment: Alignment.centerLeft,
                child: BackButton(
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),

              // Alert
              if (_alertMessage != null) ...[
                const SizedBox(height: 16),
                AlertWidget(
                  message: _alertMessage!,
                  type: _isError ? 'error' : 'success',
                  onClose: () {
                    setState(() {
                      _alertMessage = null;
                    });
                  },
                ),
              ],

              // Conteúdo principal
              if (_loading)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Column(
                    children: [
                      CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF34495E)),
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Carregando detalhes...',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                )
              else if (_room != null)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Column(
                    children: [
                      // Galeria de fotos
                      PhotoGallery(
                        photos: _room!.pictures,
                        link: true,
                      ),
                      const SizedBox(height: 24),

                      // Informações do workspace
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Nome e endereço
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _room!.name,
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.location_on_outlined,
                                    size: 16,
                                    color: Color(0xFF34495E),
                                  ),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      _room!.address,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),

                          // Comodidades
                          const Text(
                            'Comodidades',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _room!.comodities.map((amenity) {
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.grey[100],
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  amenity,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: Colors.black87,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 24),

                          // Divisória
                          Container(
                            height: 1,
                            color: Colors.grey[300],
                          ),
                          const SizedBox(height: 24),

                          // Preço e botão reservar
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'R\$${_room!.price.toStringAsFixed(2)}/hora',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green,
                                ),
                              ),
                              ElevatedButton(
                                onPressed: _handleReserve,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF34495E),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 16,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                child: const Text(
                                  'Reservar Agora',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}