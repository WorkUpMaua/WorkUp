import 'dart:io';
import 'package:flutter/material.dart';
import '../widgets/side_bar.dart';
import '../utils/user_storage.dart';

class TelaAluguelPage extends StatefulWidget {
  const TelaAluguelPage({Key? key}) : super(key: key);

  @override
  State<TelaAluguelPage> createState() => _TelaAluguelPageState();
}

class Reservation {
  final String id;
  final String workspaceId;
  final String workspaceName;
  final String workspaceImage;
  final String startDate;
  final String endDate;
  String status;
  final String address;
  final double price;
  final int capacity;

  Reservation({
    required this.id,
    required this.workspaceId,
    required this.workspaceName,
    required this.workspaceImage,
    required this.startDate,
    required this.endDate,
    required this.status,
    required this.address,
    required this.price,
    required this.capacity,
  });

  factory Reservation.fromJson(Map<String, dynamic> json) {
    return Reservation(
      id: json['id']?.toString() ?? '',
      workspaceId: json['workspaceId']?.toString() ?? '',
      workspaceName: json['workspaceName'] ?? '',
      workspaceImage: json['workspaceImage'] ?? '',
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
      status: json['status'] ?? '',
      address: json['address'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      capacity: json['capacity'] ?? 0,
    );
  }
}

class _TelaAluguelPageState extends State<TelaAluguelPage> {
  bool _sidebarActive = false;
  List<Reservation> _reservations = [];

  @override
  void initState() {
    super.initState();
    _loadReservations();
  }

  void _loadReservations() {
    // Não inicializa mais reservas mockadas
    final reservationsData = UserStorage().getReservations();

    setState(() {
      _reservations = reservationsData
          .map((data) => Reservation.fromJson(data))
          .toList();
    });
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateString;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'active':
        return Colors.green;
      case 'completed':
        return Colors.grey;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Color _getStatusBackgroundColor(String status) {
    switch (status) {
      case 'active':
        return Colors.green.shade100;
      case 'completed':
        return Colors.grey.shade100;
      case 'cancelled':
        return Colors.red.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }

  void _handleCancelReservation(String reservationId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancelar Reserva'),
        content: const Text('Tem certeza que deseja cancelar esta reserva?'),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Não', style: TextStyle(color: Colors.grey)),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();

              final success = UserStorage().updateReservationStatus(
                reservationId,
                'cancelled',
              );

              if (success) {
                _loadReservations();

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Reserva cancelada com sucesso'),
                    backgroundColor: Colors.green,
                    duration: Duration(seconds: 2),
                  ),
                );
              }
            },
            child: const Text(
              'Sim',
              style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReservationCard(Reservation reservation) {
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
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                child: _buildReservationImage(reservation.workspaceImage),
              ),
              // Badge de status
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusBackgroundColor(reservation.status),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: _getStatusColor(reservation.status),
                      width: 1.5,
                    ),
                  ),
                  child: Text(
                    _getStatusText(reservation.status),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: _getStatusColor(reservation.status),
                    ),
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
                  reservation.workspaceName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),

                // Endereço
                Text(
                  reservation.address,
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
                const SizedBox(height: 8),

                // Datas
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Check-in",
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _formatDate(reservation.startDate),
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                      Container(width: 1, height: 30, color: Colors.grey[300]),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Check-out",
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _formatDate(reservation.endDate),
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),

                // Preço e capacidade
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "R\$ ${reservation.price.toStringAsFixed(2)} / hora",
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF34495E),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.people, size: 18, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          "${reservation.capacity} pessoas",
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                // Botão de cancelar (apenas para reservas ativas)
                if (reservation.status == 'active') ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () => _handleCancelReservation(reservation.id),
                      icon: const Icon(Icons.cancel_outlined, size: 18),
                      label: const Text('Cancelar Reserva'),
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
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReservationImage(String imagePath) {
    if (imagePath.isEmpty) {
      return Container(
        height: 180,
        color: Colors.grey[300],
        child: const Icon(Icons.photo_outlined, size: 50, color: Colors.grey),
      );
    }

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
                      Text(
                        "Minhas Reservas",
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2C3E50),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 8),
                      Text(
                        "Gerencie suas reservas ativas e histórico",
                        style: TextStyle(fontSize: 14, color: Colors.grey),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),

                // Lista de reservas
                _reservations.isEmpty
                    ? Padding(
                        padding: const EdgeInsets.all(48),
                        child: Column(
                          children: [
                            Icon(
                              Icons.calendar_today_outlined,
                              size: 64,
                              color: Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              "Você ainda não possui reservas.",
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              "Explore os espaços disponíveis e faça sua primeira reserva!",
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
                        itemCount: _reservations.length,
                        itemBuilder: (context, index) {
                          return _buildReservationCard(_reservations[index]);
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
