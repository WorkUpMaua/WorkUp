import 'dart:io';
import 'package:flutter/material.dart';

import '../models/listing.dart';
import '../models/reservation.dart';
import '../services/workup_api.dart';
import '../utils/user_storage.dart';
import '../widgets/side_bar.dart';

class TelaAluguelPage extends StatefulWidget {
  const TelaAluguelPage({Key? key}) : super(key: key);

  @override
  State<TelaAluguelPage> createState() => _TelaAluguelPageState();
}

class _TelaAluguelPageState extends State<TelaAluguelPage> {
  bool _sidebarActive = false;
  final WorkupApi _api = WorkupApi();
  List<Reservation> _reservations = [];
  bool _isLoading = true;
  String? _errorMessage;
  final Set<String> _doorCodeVisible = {};

  @override
  void initState() {
    super.initState();
    _loadReservations();
  }

  Future<void> _loadReservations() async {
    final userId = UserStorage().userId;
    if (userId == null) {
      setState(() {
        _errorMessage = 'Faça login para visualizar suas reservas.';
        _isLoading = false;
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final reservations = await _api.fetchUserReservations(userId);
      UserStorage().cacheReservations(reservations);
      if (!mounted) return;
      setState(() {
        _reservations = reservations;
      });
    } on ApiException catch (err) {
      if (!mounted) return;
      setState(() {
        _errorMessage = err.message;
      });
    } catch (err) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Erro ao carregar reservas: $err';
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  String _formatDate(int timestamp) {
    final date = DateTime.fromMillisecondsSinceEpoch(timestamp);
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  Color _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return Colors.orange;
      case 'CONFIRMED':
        return Colors.green;
      case 'CANCELLED':
        return Colors.red;
      case 'EXPIRED':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  Color _getStatusBackgroundColor(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return Colors.orange.shade100;
      case 'CONFIRMED':
        return Colors.green.shade100;
      case 'CANCELLED':
        return Colors.red.shade100;
      case 'EXPIRED':
        return Colors.grey.shade200;
      default:
        return Colors.grey.shade100;
    }
  }

  String _getStatusText(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pendente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'CANCELLED':
        return 'Cancelada';
      case 'EXPIRED':
        return 'Expirada';
      default:
        return status;
    }
  }

  bool _canCancel(String status) {
    final normalized = status.toUpperCase();
    return normalized == 'PENDING' || normalized == 'CONFIRMED';
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
            onPressed: () async {
              Navigator.of(context).pop();

              try {
                await _api.deleteReservation(reservationId);
                if (!mounted) return;
                await _loadReservations();
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Reserva removida com sucesso'),
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
                    content: Text('Erro ao cancelar reserva: $err'),
                    backgroundColor: Colors.red,
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
    final room = UserStorage().getCatalogRoom(reservation.workspaceId);

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 5,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                child: _buildReservationImage(room),
              ),
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
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  room?.name ?? 'Espaço ${reservation.workspaceId}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  room?.address ?? 'Endereço indisponível',
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
                const SizedBox(height: 12),
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
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Total: R\$ ${reservation.finalPrice.toStringAsFixed(2)}",
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
                          "${room?.capacity ?? '-'} pessoas",
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                if (reservation.doorCode != null &&
                    reservation.doorCode!.isNotEmpty &&
                    reservation.status.toUpperCase() == 'CONFIRMED')
                  _buildDoorCode(reservation),
                if (_canCancel(reservation.status)) ...[
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

  Widget _buildReservationImage(Listing? room) {
    final imagePath = (room?.pictures.isNotEmpty ?? false)
        ? room!.pictures.first
        : null;

    if (imagePath != null && imagePath.startsWith('http')) {
      return Image.network(
        imagePath,
        width: double.infinity,
        height: 180,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => _reservationPlaceholder(),
      );
    } else if (imagePath != null) {
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
            );
          }
          return _reservationPlaceholder();
        },
      );
    } else {
      return _reservationPlaceholder();
    }
  }

  Widget _reservationPlaceholder() {
    return Container(
      height: 180,
      color: Colors.grey[300],
      child: const Icon(Icons.photo_outlined, size: 50, color: Colors.grey),
    );
  }

  Widget _buildDoorCode(Reservation reservation) {
    final isVisible = _doorCodeVisible.contains(reservation.id);
    final masked = '•' * reservation.doorCode!.length;
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.green.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.green.shade200),
        ),
        child: Row(
          children: [
            const Icon(Icons.lock, color: Colors.green),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Código da Porta',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF2C3E50),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    isVisible ? reservation.doorCode! : masked,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 4,
                      color: Colors.green[800],
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: Icon(
                isVisible ? Icons.visibility_off : Icons.visibility,
                color: Colors.green[700],
              ),
              onPressed: () {
                setState(() {
                  if (isVisible) {
                    _doorCodeVisible.remove(reservation.id);
                  } else {
                    _doorCodeVisible.add(reservation.id);
                  }
                });
              },
            ),
          ],
        ),
      ),
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
          body: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _errorMessage != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.red[300],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _errorMessage!,
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.red,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _loadReservations,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Tentar novamente'),
                        ),
                      ],
                    ),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadReservations,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      children: [
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
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
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
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                ),
                                itemCount: _reservations.length,
                                itemBuilder: (context, index) {
                                  return _buildReservationCard(
                                    _reservations[index],
                                  );
                                },
                              ),
                      ],
                    ),
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
