import 'package:flutter/material.dart';

import '../models/listing.dart';
import '../services/workup_api.dart';
import '../utils/user_storage.dart';
import '../widgets/header_bar.dart';
import '../widgets/side_bar.dart';
import 'workspace.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final WorkupApi _api = WorkupApi();
  List<Listing> filteredListings = [];
  List<Listing> _allListings = [];
  TextEditingController searchController = TextEditingController();
  bool isLoading = true;
  bool _sidebarActive = false;
  String? _errorMessage;

  String normalizeText(String text) {
    return text
        .toLowerCase()
        .replaceAll('á', 'a')
        .replaceAll('à', 'a')
        .replaceAll('ã', 'a')
        .replaceAll('â', 'a')
        .replaceAll('é', 'e')
        .replaceAll('ê', 'e')
        .replaceAll('í', 'i')
        .replaceAll('ó', 'o')
        .replaceAll('ô', 'o')
        .replaceAll('õ', 'o')
        .replaceAll('ú', 'u')
        .replaceAll('ç', 'c');
  }

  @override
  void initState() {
    super.initState();
    _loadAllProperties();
  }

  Future<void> _loadAllProperties() async {
    setState(() {
      isLoading = true;
      _errorMessage = null;
    });

    try {
      final rooms = await _api.fetchCatalogo();
      UserStorage().cacheCatalog(rooms);
      if (!mounted) return;
      setState(() {
        _allListings = rooms;
        filteredListings = rooms;
      });
    } on ApiException catch (err) {
      if (!mounted) return;
      setState(() {
        _errorMessage = err.message;
      });
    } catch (err) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Erro ao carregar propriedades: $err';
      });
    } finally {
      if (mounted) {
        setState(() => isLoading = false);
      }
    }
  }

  void filterRooms(String query) {
    final normalizedQuery = normalizeText(query.trim());

    setState(() {
      if (normalizedQuery.isEmpty) {
        filteredListings = List<Listing>.from(_allListings);
      } else {
        filteredListings = _allListings.where((room) {
          final normalizedName = normalizeText(room.name);
          final normalizedAddress = normalizeText(room.address);

          return normalizedName.contains(normalizedQuery) ||
              normalizedAddress.contains(normalizedQuery);
        }).toList();
      }
    });
  }

  Widget buildRoomCard(Listing room) {
    final imageUrl = room.pictures
        .firstWhere((pic) => pic.trim().isNotEmpty, orElse: () => '')
        .trim();

    return GestureDetector(
      onTap: () {
        // Navega para a tela de detalhes do workspace
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => WorkSpacePage(
              propertyId: room.id,
              onReserve: () {
                // Atualiza a lista após reserva
                _loadAllProperties();
              },
            ),
          ),
        );
      },
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 5,
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (imageUrl.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                child: _buildRoomImage(imageUrl),
              ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    room.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    room.address,
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "R\$ ${room.price.toStringAsFixed(2)} / hora",
                    style: const TextStyle(
                      fontSize: 16,
                      color: Color(0xFF34495E),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.people, size: 18, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        "${room.capacity} pessoas",
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
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
  }

  Widget _buildRoomImage(String imagePath) {
    final url = imagePath.trim();
    if (!url.startsWith('http')) {
      return _imagePlaceholder();
    }

    return Image.network(
      url,
      width: double.infinity,
      height: 180,
      fit: BoxFit.cover,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return Container(
          height: 180,
          color: Colors.grey[200],
          alignment: Alignment.center,
          child: const CircularProgressIndicator(strokeWidth: 2),
        );
      },
      errorBuilder: (context, error, stackTrace) => _imagePlaceholder(),
    );
  }

  Widget _imagePlaceholder() {
    return Container(
      height: 180,
      color: Colors.grey[300],
      child: const Icon(Icons.photo_outlined, size: 50, color: Colors.grey),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          body: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFF8FAFC), Color(0xFFEFF1F4)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: RefreshIndicator(
              onRefresh: _loadAllProperties,
              child: CustomScrollView(
                slivers: [
                  SliverAppBar(
                    pinned: true,
                    automaticallyImplyLeading: false,
                    flexibleSpace: HeaderBar(
                      onMenuClick: () => setState(() => _sidebarActive = true),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                      child: Column(
                        children: [
                          const Text(
                            "Encontre o espaço perfeito para seu negócio",
                            style: TextStyle(
                              fontSize: 20,
                              color: Color(0xFF2C3E50),
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            "Descubra escritórios e salas comerciais que combinam com sua necessidade",
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                          const SizedBox(height: 20),
                          TextField(
                            controller: searchController,
                            decoration: InputDecoration(
                              hintText: "Buscar sala...",
                              prefixIcon: const Icon(Icons.search),
                              filled: true,
                              fillColor: Colors.white,
                              contentPadding: const EdgeInsets.symmetric(
                                vertical: 14,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  color: Colors.grey,
                                  width: 0.5,
                                ),
                              ),
                            ),
                            onChanged: filterRooms,
                          ),
                          const SizedBox(height: 20),
                        ],
                      ),
                    ),
                  ),
                  if (isLoading)
                    const SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.all(20.0),
                          child: CircularProgressIndicator(),
                        ),
                      ),
                    )
                  else if (_errorMessage != null)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Column(
                          children: [
                            Icon(
                              Icons.warning_amber_rounded,
                              size: 56,
                              color: Colors.red[300],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              _errorMessage!,
                              style: const TextStyle(
                                fontSize: 16,
                                color: Colors.red,
                                fontWeight: FontWeight.w500,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton.icon(
                              onPressed: _loadAllProperties,
                              icon: const Icon(Icons.refresh),
                              label: const Text('Tentar novamente'),
                            ),
                          ],
                        ),
                      ),
                    )
                  else if (filteredListings.isEmpty)
                    SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: const EdgeInsets.all(48.0),
                          child: Column(
                            children: [
                              Icon(
                                Icons.business_outlined,
                                size: 64,
                                color: Colors.grey[400],
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                "Nenhum espaço disponível no momento.",
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                "Crie uma nova propriedade ou aguarde novos espaços!",
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  else
                    SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) =>
                            buildRoomCard(filteredListings[index]),
                        childCount: filteredListings.length,
                      ),
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
