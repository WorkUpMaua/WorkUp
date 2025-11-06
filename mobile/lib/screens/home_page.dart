import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../widgets/side_bar.dart';
import '../widgets/models_listing.dart';
import '../widgets/header_bar.dart';

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

  // Filtros (declarados mas não usados na UI - PROBLEMA)
  DateTime? startDate;
  DateTime? endDate;
  String guests = "";
  String minPrice = "";
  String maxPrice = "";

  final List<Listing> mockRooms = [
    Listing(
      id: '1',
      name: 'Escritório Moderno no Centro',
      address: 'Rua Augusta, 1500 - São Paulo, SP',
      comodities: ['Wi-Fi', 'Ar Condicionado', 'Café', 'Estacionamento'],
      pictures: [
        'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
      ],
      price: 75.0,
      capacity: 8,
    ),
    Listing(
      id: '2',
      name: 'Sala de Reunião Premium',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      comodities: ['Projetor', 'Wi-Fi', 'Lousa', 'Café'],
      pictures: [
        'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
      ],
      price: 120.0,
      capacity: 12,
    ),
    Listing(
      id: '3',
      name: 'Coworking Vista Panorâmica',
      address: 'Rua Oscar Freire, 2500 - São Paulo, SP',
      comodities: ['Vista Panorâmica', 'Wi-Fi', 'Copa', 'Academia'],
      pictures: [
        'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg',
      ],
      price: 45.0,
      capacity: 20,
    ),
    Listing(
      id: '4',
      name: 'Sala Executiva Premium',
      address: 'Av. Brigadeiro Faria Lima, 3477 - São Paulo, SP',
      comodities: ['Secretária', 'Wi-Fi', 'Café', 'Estacionamento VIP'],
      pictures: [
        'https://images.pexels.com/photos/1743555/pexels-photo-1743555.jpeg',
      ],
      price: 200.0,
      capacity: 4,
    ),
  ];

  @override
  void initState() {
    super.initState();
    // Usando dados mockados em vez de fazer chamada à API
    setState(() {
      filteredListings = mockRooms;
      isLoading = false;
    });
  }

  Future<void> fetchAllRooms() async {
    setState(() => isLoading = true);
    try {
      final response = await http.get(
        Uri.parse("http://10.0.2.2:3000/availability"),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final rooms = data["rooms"];
        final allRooms = (rooms as Map).values.map((room) {
          return Listing.fromJson(room);
        }).toList();
        setState(() {
          filteredListings = List<Listing>.from(allRooms);
        });
      } else {
        debugPrint("Erro ao carregar salas: ${response.statusCode}");
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Erro ao carregar salas: $e')));
      }
    }
    setState(() => isLoading = false);
  }

  double parseMoney(String str) {
    final normalized = str.replaceAll('.', '').replaceAll(',', '.');
    return double.tryParse(normalized) ?? 0.0;
  }

  void filterRooms(String query) {
    final normalizedQuery = normalizeText(query.trim());

    setState(() {
      if (normalizedQuery.isEmpty) {
        filteredListings = List<Listing>.from(mockRooms);
      } else {
        filteredListings = mockRooms.where((room) {
          final normalizedName = normalizeText(room.name);
          final normalizedAddress = normalizeText(room.address);

          return normalizedName.contains(normalizedQuery) ||
              normalizedAddress.contains(normalizedQuery);
        }).toList();
      }
    });
  }

  Widget buildRoomCard(Listing room) {
    return Card(
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
              child: Image.network(
                room.pictures.first,
                width: double.infinity,
                height: 180,
                fit: BoxFit.cover,
              ),
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
                      style: const TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
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
                  const SliverToBoxAdapter(
                    child: Center(
                      child: Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Text("Nenhum espaço encontrado."),
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
