import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../components/header_bar.dart';
import '../components/sidebar_menu.dart';
import '../models/listing.dart'; // USA O MODELO CENTRALIZADO

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Listing> filteredListings = [];
  String searchQuery = "";
  TextEditingController searchController = TextEditingController();
  bool isLoading = false;
  bool _sidebarActive = false;

  // Filtros (declarados mas não usados na UI - PROBLEMA)
  DateTime? startDate;
  DateTime? endDate;
  String guests = "";
  String minPrice = "";
  String maxPrice = "";

  @override
  void initState() {
    super.initState();
    fetchAllRooms();
  }

  Future<void> fetchAllRooms() async {
    setState(() => isLoading = true);
    try {
      final response =
          await http.get(Uri.parse("http://10.0.2.2:3000/availability"));
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
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao carregar salas: $e')),
        );
      }
    }
    setState(() => isLoading = false);
  }

  double parseMoney(String str) {
    final normalized = str.replaceAll('.', '').replaceAll(',', '.');
    return double.tryParse(normalized) ?? 0.0;
  }

  Future<void> handleSearch() async {
    setState(() => isLoading = true);

    final params = <String, String>{};
    if (minPrice.isNotEmpty) {
      params['minPrice'] = parseMoney(minPrice).toString();
    }
    if (maxPrice.isNotEmpty) {
      params['maxPrice'] = parseMoney(maxPrice).toString();
    }
    if (guests.isNotEmpty) params['capacity'] = guests;

    final uri = Uri.http("10.0.2.2:3000", "/availability", params);

    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final rooms = data["rooms"];
        List<Listing> availableRooms = (rooms as Map)
            .values
            .map((room) => Listing.fromJson(room))
            .toList();

        if (searchQuery.trim().isNotEmpty) {
          final lower = searchQuery.toLowerCase();
          availableRooms = availableRooms
              .where((room) => room.name.toLowerCase().contains(lower))
              .toList();
        }

        setState(() {
          filteredListings = availableRooms;
        });
      } else {
        debugPrint("Erro ao buscar disponibilidade: ${response.statusCode}");
      }
    } catch (e) {
      debugPrint("Erro: $e");
    }

    setState(() => isLoading = false);
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
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
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
                Text(room.name,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Text(room.address,
                    style: const TextStyle(fontSize: 14, color: Colors.grey)),
                const SizedBox(height: 8),
                Text("R\$ ${room.price.toStringAsFixed(2)} / hora",
                    style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF34495E),
                        fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.people, size: 18, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text("${room.capacity} pessoas",
                        style: const TextStyle(fontSize: 14, color: Colors.grey)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildBody() {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (filteredListings.isEmpty) {
      return const Center(child: Text("Nenhum espaço encontrado."));
    }
    return ListView.builder(
      itemCount: filteredListings.length,
      itemBuilder: (context, index) => buildRoomCard(filteredListings[index]),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          appBar: HeaderBar(
            onMenuClick: () => setState(() => _sidebarActive = true),
          ),
          body: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFF8FAFC), Color(0xFFEFF1F4)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              children: [
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      const Text(
                        "Encontre o espaço perfeito para seu negócio",
                        style: TextStyle(
                            fontSize: 20,
                            color: Color(0xFF2C3E50),
                            fontWeight: FontWeight.bold),
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
                          contentPadding:
                              const EdgeInsets.symmetric(vertical: 14),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                                color: Colors.grey, width: 0.5),
                          ),
                        ),
                        onChanged: (v) => setState(() => searchQuery = v),
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: handleSearch,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF34495E),
                          minimumSize: const Size.fromHeight(50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text("Buscar Disponibilidade",
                            style: TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                Expanded(child: buildBody()),
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