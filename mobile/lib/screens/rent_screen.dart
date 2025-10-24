import 'package:flutter/material.dart';

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
  final String status;

  Reservation({
    required this.id,
    required this.workspaceId,
    required this.workspaceName,
    required this.workspaceImage,
    required this.startDate,
    required this.endDate,
    required this.status,
  });
}

class _TelaAluguelPageState extends State<TelaAluguelPage> {
  // Temporary mock data - this should be replaced with actual API calls
  final List<Reservation> _mockReservations = [
    Reservation(
      id: '1',
      workspaceId: '1',
      workspaceName: 'Escritório Moderno no Centro',
      workspaceImage: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
      startDate: '2025-05-20',
      endDate: '2025-03-31',
      status: 'active',
    ),
    Reservation(
      id: '2',
      workspaceId: '2',
      workspaceName: 'Sala Comercial Premium',
      workspaceImage: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      status: 'active',
    ),
    Reservation(
      id: '3',
      workspaceId: '3',
      workspaceName: 'Sala Comercial Premium',
      workspaceImage: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      status: 'active',
    ),
  ];

  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString);
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
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
    // Implement cancellation logic
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancelar Reserva'),
        content: const Text('Tem certeza que deseja cancelar esta reserva?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Não'),
          ),
          TextButton(
            onPressed: () {
              // Implement cancellation API call
              Navigator.of(context).pop();
            },
            child: const Text('Sim'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF34495E);
    final secondaryColor = const Color(0xFF2C3E50);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text("Minhas Reservas"),
        backgroundColor: primaryColor,
        centerTitle: true,
        elevation: 3,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
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
              child: Column(
                children: [
                  // Header com gradiente
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [primaryColor, secondaryColor],
                      ),
                    ),
                    child: const Column(
                      children: [
                        Text(
                          "Minhas Reservas",
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),

                  // Lista de reservas
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: _mockReservations.isEmpty
                        ? const Padding(
                            padding: EdgeInsets.symmetric(vertical: 48),
                            child: Text(
                              "Você ainda não possui reservas.",
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          )
                        : GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: _mockReservations.length < 3 ? 1 : 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 0.8,
                            ),
                            itemCount: _mockReservations.length,
                            itemBuilder: (context, index) {
                              final reservation = _mockReservations[index];
                              return Card(
                                elevation: 4,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(12),
                                    color: Colors.white,
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      // Imagem do workspace
                                      ClipRRect(
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(12),
                                          topRight: Radius.circular(12),
                                        ),
                                        child: Image.network(
                                          reservation.workspaceImage,
                                          height: 150,
                                          width: double.infinity,
                                          fit: BoxFit.cover,
                                          errorBuilder: (context, error, stackTrace) {
                                            return Container(
                                              height: 150,
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

                                      // Informações da reserva
                                      Padding(
                                        padding: const EdgeInsets.all(16),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            // Nome do workspace
                                            Text(
                                              reservation.workspaceName,
                                              style: const TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.black87,
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 12),

                                            // Datas
                                            Column(
                                              children: [
                                                Row(
                                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                  children: [
                                                    const Text(
                                                      "Check-in:",
                                                      style: TextStyle(
                                                        fontSize: 14,
                                                        color: Colors.grey,
                                                      ),
                                                    ),
                                                    Text(
                                                      _formatDate(reservation.startDate),
                                                      style: const TextStyle(
                                                        fontSize: 14,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                const SizedBox(height: 6),
                                                Row(
                                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                  children: [
                                                    const Text(
                                                      "Check-out:",
                                                      style: TextStyle(
                                                        fontSize: 14,
                                                        color: Colors.grey,
                                                      ),
                                                    ),
                                                    Text(
                                                      _formatDate(reservation.endDate),
                                                      style: const TextStyle(
                                                        fontSize: 14,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 12),

                                            // Status e botão de cancelar
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                // Status
                                                Container(
                                                  padding: const EdgeInsets.symmetric(
                                                    horizontal: 12,
                                                    vertical: 6,
                                                  ),
                                                  decoration: BoxDecoration(
                                                    color: _getStatusBackgroundColor(reservation.status),
                                                    borderRadius: BorderRadius.circular(20),
                                                  ),
                                                  child: Text(
                                                    _getStatusText(reservation.status),
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      fontWeight: FontWeight.w500,
                                                      color: _getStatusColor(reservation.status),
                                                    ),
                                                  ),
                                                ),

                                                // Botão cancelar (apenas para reservas ativas)
                                                if (reservation.status == 'active')
                                                  GestureDetector(
                                                    onTap: () => _handleCancelReservation(reservation.id),
                                                    child: const Text(
                                                      "Cancelar reserva",
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        color: Colors.red,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                  ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
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