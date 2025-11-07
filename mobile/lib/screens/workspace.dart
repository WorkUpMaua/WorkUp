import 'dart:io';
import 'package:flutter/material.dart';
import '../utils/user_storage.dart';
import 'home_page.dart';

class WorkSpacePage extends StatefulWidget {
  final String propertyId;
  final VoidCallback? onReserve;

  const WorkSpacePage({Key? key, required this.propertyId, this.onReserve})
    : super(key: key);

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
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      comodities: List<String>.from(json['comodities'] ?? []),
      pictures: List<String>.from(json['pictures'] ?? []),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      capacity: (json['capacity'] as num?)?.toInt() ?? 0,
    );
  }
}

class _WorkSpacePageState extends State<WorkSpacePage> {
  RoomDetails? _room;
  bool _loading = true;
  String? _alertMessage;
  bool _isError = false;
  DateTime? _startDate;
  DateTime? _endDate;
  int _selectedImageIndex = 0;
  final PageController _pageController = PageController();

  final Color primaryColor = const Color(0xFF34495E);
  final Color backgroundColor = const Color(0xFFF4F6FA);

  @override
  void initState() {
    super.initState();
    _fetchRoom();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _fetchRoom() async {
    try {
      await Future.delayed(const Duration(milliseconds: 500));

      final property = UserStorage().getPropertyById(widget.propertyId);

      if (property != null) {
        setState(() {
          _room = RoomDetails.fromJson(property);
          _loading = false;
        });
      } else {
        setState(() {
          _alertMessage = 'Propriedade não encontrada.';
          _isError = true;
          _loading = false;
        });
      }
    } catch (err) {
      setState(() {
        _alertMessage = 'ERRO: Não foi possível carregar detalhes da sala.';
        _isError = true;
        _loading = false;
      });
    }
  }

  Future<void> _selectDateRange() async {
    final now = DateTime.now();

    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: now,
      lastDate: DateTime(now.year + 2, 12, 31),
      initialDateRange: _startDate != null && _endDate != null
          ? DateTimeRange(start: _startDate!, end: _endDate!)
          : null,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: primaryColor,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: Colors.black,
            ),
            dialogBackgroundColor: Colors.white,
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _startDate = picked.start;
        _endDate = picked.end;
      });
    }
  }

  void _handleReserve() async {
    if (_startDate == null || _endDate == null) {
      setState(() {
        _alertMessage =
            'Por favor, selecione as datas de check-in e check-out.';
        _isError = true;
      });
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) setState(() => _alertMessage = null);
      });
      return;
    }

    if (_room == null) return;

    final reservation = {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'workspaceId': _room!.id,
      'workspaceName': _room!.name,
      'workspaceImage': _room!.pictures.isNotEmpty ? _room!.pictures.first : '',
      'startDate': _startDate!.toIso8601String(),
      'endDate': _endDate!.toIso8601String(),
      'status': 'active',
      'address': _room!.address,
      'price': _room!.price,
      'capacity': _room!.capacity,
    };

    final success = UserStorage().addReservation(reservation);

    if (success) {
      UserStorage().markPropertyAsRented(widget.propertyId);

      setState(() {
        _alertMessage = 'Reserva realizada com sucesso!';
        _isError = false;
      });

      await Future.delayed(const Duration(milliseconds: 1500));

      if (mounted) {
        if (widget.onReserve != null) {
          widget.onReserve!();
        }

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomePage()),
        );
      }
    } else {
      setState(() {
        _alertMessage = 'Erro ao realizar reserva.';
        _isError = true;
      });
    }
  }

  Widget _buildPropertyImage(String imagePath) {
    if (imagePath.startsWith('http')) {
      return Image.network(
        imagePath,
        width: double.infinity,
        height: 320,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            height: 320,
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
      final file = File(imagePath);
      return FutureBuilder<bool>(
        future: file.exists(),
        builder: (context, snapshot) {
          if (snapshot.hasData && snapshot.data == true) {
            return Image.file(
              file,
              width: double.infinity,
              height: 320,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 320,
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
            return Container(
              height: 320,
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

  Widget _buildPhotoCarousel() {
    if (_room == null || _room!.pictures.isEmpty) {
      return Container(
        height: 320,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Center(
          child: Icon(Icons.photo_outlined, size: 50, color: Colors.grey),
        ),
      );
    }

    return Column(
      children: [
        // Imagem principal com PageView
        Container(
          height: 320,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Stack(
              children: [
                PageView.builder(
                  controller: _pageController,
                  itemCount: _room!.pictures.length,
                  onPageChanged: (index) {
                    setState(() {
                      _selectedImageIndex = index;
                    });
                  },
                  itemBuilder: (context, index) {
                    return _buildPropertyImage(_room!.pictures[index]);
                  },
                ),
                // Indicador de posição
                if (_room!.pictures.length > 1)
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '${_selectedImageIndex + 1}/${_room!.pictures.length}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),

        // Miniaturas clicáveis
        if (_room!.pictures.length > 1) ...[
          const SizedBox(height: 16),
          SizedBox(
            height: 80,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _room!.pictures.length,
              itemBuilder: (context, index) {
                final isSelected = _selectedImageIndex == index;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedImageIndex = index;
                    });
                    _pageController.animateToPage(
                      index,
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  },
                  child: Container(
                    width: 80,
                    height: 80,
                    margin: const EdgeInsets.only(right: 12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? primaryColor : Colors.grey.shade300,
                        width: isSelected ? 3 : 2,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: primaryColor.withOpacity(0.3),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ]
                          : [],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: _buildThumbnail(_room!.pictures[index]),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildThumbnail(String imagePath) {
    if (imagePath.startsWith('http')) {
      return Image.network(
        imagePath,
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
      );
    } else {
      final file = File(imagePath);
      return FutureBuilder<bool>(
        future: file.exists(),
        builder: (context, snapshot) {
          if (snapshot.hasData && snapshot.data == true) {
            return Image.file(file, fit: BoxFit.cover);
          } else {
            return Container(
              color: Colors.grey[300],
              child: const Icon(
                Icons.photo_outlined,
                size: 30,
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
    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Botão voltar
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: IconButton(
                      icon: Icon(Icons.arrow_back, color: primaryColor),
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const HomePage(),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ),

              // Alert
              if (_alertMessage != null)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: _isError ? Colors.red[100] : Colors.green[100],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _isError ? Colors.red : Colors.green,
                        width: 1.5,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          _isError
                              ? Icons.error_outline
                              : Icons.check_circle_outline,
                          color: _isError ? Colors.red : Colors.green,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _alertMessage!,
                            style: TextStyle(
                              color: _isError
                                  ? Colors.red[800]
                                  : Colors.green[800],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Conteúdo principal
              if (_loading)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 60),
                  child: Column(
                    children: [
                      CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Carregando detalhes...',
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    ],
                  ),
                )
              else if (_room != null)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Carrossel de fotos
                      _buildPhotoCarousel(),
                      const SizedBox(height: 24),

                      // Nome
                      Text(
                        _room!.name,
                        style: const TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2C3E50),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Endereço
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_outlined,
                            size: 18,
                            color: primaryColor,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              _room!.address,
                              style: const TextStyle(
                                fontSize: 15,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Capacidade
                      Row(
                        children: [
                          Icon(
                            Icons.people_outline,
                            size: 18,
                            color: primaryColor,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Capacidade: ${_room!.capacity} pessoas',
                            style: const TextStyle(
                              fontSize: 15,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Divisória
                      Container(height: 1, color: Colors.grey[300]),
                      const SizedBox(height: 24),

                      // Comodidades
                      const Text(
                        'Comodidades',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2C3E50),
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
                              color: Colors.blue[50],
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: Colors.blue[200]!),
                            ),
                            child: Text(
                              amenity,
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.blue[800],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Divisória
                      Container(height: 1, color: Colors.grey[300]),
                      const SizedBox(height: 24),

                      // Seleção de datas
                      const Text(
                        'Período da Reserva',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2C3E50),
                        ),
                      ),
                      const SizedBox(height: 12),
                      GestureDetector(
                        onTap: _selectDateRange,
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: backgroundColor,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.calendar_today,
                                color: primaryColor,
                                size: 22,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  _startDate != null && _endDate != null
                                      ? '${_startDate!.day.toString().padLeft(2, '0')}/${_startDate!.month.toString().padLeft(2, '0')}/${_startDate!.year} - ${_endDate!.day.toString().padLeft(2, '0')}/${_endDate!.month.toString().padLeft(2, '0')}/${_endDate!.year}'
                                      : 'Selecione as datas',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: _startDate != null
                                        ? const Color(0xFF2C3E50)
                                        : Colors.grey,
                                    fontWeight: _startDate != null
                                        ? FontWeight.w500
                                        : FontWeight.normal,
                                  ),
                                ),
                              ),
                              Icon(
                                Icons.arrow_forward_ios,
                                size: 16,
                                color: Colors.grey[400],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Divisória
                      Container(height: 1, color: Colors.grey[300]),
                      const SizedBox(height: 24),

                      // Preço e botão reservar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Preço',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'R\$ ${_room!.price.toStringAsFixed(2)}/hora',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green,
                                ),
                              ),
                            ],
                          ),
                          ElevatedButton(
                            onPressed: _handleReserve,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primaryColor,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 32,
                                vertical: 16,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 2,
                            ),
                            child: const Row(
                              children: [
                                Icon(
                                  Icons.check_circle_outline,
                                  color: Colors.white,
                                  size: 20,
                                ),
                                SizedBox(width: 8),
                                Text(
                                  'Reservar',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
