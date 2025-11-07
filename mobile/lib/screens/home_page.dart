import 'dart:io';
import 'package:flutter/material.dart';
import '../widgets/side_bar.dart';
import '../widgets/models_listing.dart';
import '../widgets/header_bar.dart';
import '../utils/user_storage.dart';
import 'workspace.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Listing> filteredListings = [];
  TextEditingController searchController = TextEditingController();
  bool isLoading = false;
  bool _sidebarActive = false;

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

  void _loadAllProperties() {
    setState(() => isLoading = true);

    // Carrega APENAS propriedades criadas pelos usuários (sem mock)
    List<Listing> allListings = [];

    // Carrega propriedades disponíveis (não alugadas ou canceladas)
    final availableProperties = UserStorage().getAvailableProperties();

    for (var propData in availableProperties) {
      allListings.add(Listing.fromJson(propData));
    }

    setState(() {
      filteredListings = allListings;
      isLoading = false;
    });
  }

  void filterRooms(String query) {
    _loadAllProperties(); // Recarrega todas as propriedades primeiro

    final normalizedQuery = normalizeText(query.trim());

    if (normalizedQuery.isEmpty) {
      return; // Já foi carregado tudo no _loadAllProperties
    }

    setState(() {
      filteredListings = filteredListings.where((room) {
        final normalizedName = normalizeText(room.name);
        final normalizedAddress = normalizeText(room.address);

        return normalizedName.contains(normalizedQuery) ||
            normalizedAddress.contains(normalizedQuery);
      }).toList();
    });
  }

  Widget buildRoomCard(Listing room) {
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
            if (room.pictures.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                child: _buildRoomImage(room.pictures.first),
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

  // Método para construir a imagem (local ou da internet)
  Widget _buildRoomImage(String imagePath) {
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
        SidebarMenu(
          active: _sidebarActive,
          onClose: () => setState(() => _sidebarActive = false),
        ),
      ],
    );
  }
}
