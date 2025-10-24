import 'package:flutter/material.dart';

class TelaPropriedadePage extends StatefulWidget {
  const TelaPropriedadePage({Key? key}) : super(key: key);

  @override
  State<TelaPropriedadePage> createState() => _TelaPropriedadePageState();
}

class Listing {
  final String id;
  final String name;
  final List<String> pictures;
  final double price;
  final String address;
  final List<String> comodities;
  final int capacity;

  Listing({
    required this.id,
    required this.name,
    required this.pictures,
    required this.price,
    required this.address,
    required this.comodities,
    required this.capacity,
  });

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      pictures: List<String>.from(json['pictures'] ?? []),
      price: (json['price'] ?? 0).toDouble(),
      address: json['address'] ?? '',
      comodities: List<String>.from(json['comodities'] ?? []),
      capacity: json['capacity'] ?? 0,
    );
  }
}

class ListingCard extends StatelessWidget {
  final Listing listing;

  const ListingCard({Key? key, required this.listing}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Imagem da propriedade
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(12),
              topRight: Radius.circular(12),
            ),
            child: listing.pictures.isNotEmpty
                ? Image.network(
                    listing.pictures.first,
                    height: 160,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 160,
                        color: Colors.grey[300],
                        child: const Icon(
                          Icons.photo_outlined,
                          size: 50,
                          color: Colors.grey,
                        ),
                      );
                    },
                  )
                : Container(
                    height: 160,
                    color: Colors.grey[300],
                    child: const Icon(
                      Icons.photo_outlined,
                      size: 50,
                      color: Colors.grey,
                    ),
                  ),
          ),

          // Informações da propriedade
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Nome
                Text(
                  listing.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF34495E),
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),

                // Endereço
                Text(
                  listing.address,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),

                // Preço
                Text(
                  'R\$${listing.price.toStringAsFixed(2)}/hora',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(height: 8),

                // Capacidade
                Row(
                  children: [
                    const Icon(
                      Icons.people_outline,
                      size: 16,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${listing.capacity} pessoas',
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Comodidades
                if (listing.comodities.isNotEmpty)
                  Wrap(
                    spacing: 4,
                    runSpacing: 4,
                    children: listing.comodities.take(3).map((comodity) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.blue[100]!),
                        ),
                        child: Text(
                          comodity,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.blue[800],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _TelaPropriedadePageState extends State<TelaPropriedadePage> {
  final List<Listing> _properties = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchProperties();
  }

  Future<void> _fetchProperties() async {
    try {
      // Simulação da chamada API - substitua pelo seu client real
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock data para demonstração - substitua pela chamada real
      final mockProperties = [
        Listing(
          id: '1',
          name: 'Sala de Reunião Executive',
          pictures: ['https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg'],
          price: 150.00,
          address: 'Av. Paulista, 1000 - São Paulo/SP',
          comodities: ['Wi-Fi', 'Ar-condicionado', 'Projetor'],
          capacity: 10,
        ),
        Listing(
          id: '2',
          name: 'Escritório Privativo',
          pictures: ['https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg'],
          price: 200.00,
          address: 'Rua Augusta, 500 - São Paulo/SP',
          comodities: ['Wi-Fi', 'Café', 'Impressora'],
          capacity: 6,
        ),
      ];

      setState(() {
        _properties.addAll(mockProperties);
        _isLoading = false;
      });
    } catch (err) {
      setState(() {
        _errorMessage = "Erro ao carregar as propriedades";
        _isLoading = false;
      });
      print("Erro ao carregar todas as salas: $err");
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF34495E);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text("Suas Propriedades"),
        backgroundColor: primaryColor,
        centerTitle: true,
        elevation: 3,
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF34495E)),
              ),
            )
          : _errorMessage != null
              ? Center(
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.red,
                    ),
                    textAlign: TextAlign.center,
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      // Título principal
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Text(
                          "Suas Propriedades",
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF2C3E50),
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),

                      // Seção de Propriedades Ativas
                      Container(
                        width: double.infinity,
                        margin: const EdgeInsets.only(bottom: 24),
                        child: Column(
                          children: [
                            // Header com linhas gradientes
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Container(
                                      height: 1,
                                      decoration: const BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [
                                            Color(0xFF34495E),
                                            Colors.blue,
                                            Colors.transparent,
                                          ],
                                          stops: [0.0, 0.5, 1.0],
                                        ),
                                      ),
                                    ),
                                  ),
                                  const Padding(
                                    padding: EdgeInsets.symmetric(horizontal: 16),
                                    child: Text(
                                      "Propriedades Ativas",
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFF34495E),
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: Container(
                                      height: 1,
                                      decoration: const BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [
                                            Colors.transparent,
                                            Colors.blue,
                                            Color(0xFF34495E),
                                          ],
                                          stops: [0.0, 0.5, 1.0],
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Grid de propriedades
                            _properties.isEmpty
                                ? const Padding(
                                    padding: EdgeInsets.symmetric(vertical: 32),
                                    child: Text(
                                      "Nenhuma propriedade ativa no momento.",
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.grey,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  )
                                : GridView.builder(
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    gridDelegate:
                                        const SliverGridDelegateWithFixedCrossAxisCount(
                                      crossAxisCount: 1,
                                      crossAxisSpacing: 16,
                                      mainAxisSpacing: 16,
                                      childAspectRatio: 0.8,
                                    ),
                                    itemCount: _properties.length,
                                    itemBuilder: (context, index) {
                                      final property = _properties[index];
                                      return ListingCard(listing: property);
                                    },
                                  ),
                          ],
                        ),
                      ),

                      /**
                       * @todo: colocar propriedades antigas ?
                       */

                      // // Divisória para histórico (comentada)
                      // Padding(
                      //   padding: const EdgeInsets.symmetric(vertical: 16),
                      //   child: Row(
                      //     children: [
                      //       Expanded(
                      //         child: Container(
                      //           height: 2,
                      //           decoration: const BoxDecoration(
                      //             gradient: LinearGradient(
                      //               colors: [
                      //                 Colors.grey,
                      //                 Color(0xFF34495E),
                      //                 Colors.transparent,
                      //               ],
                      //             ),
                      //           ),
                      //         ),
                      //       ),
                      //       const Padding(
                      //         padding: EdgeInsets.symmetric(horizontal: 16),
                      //         child: Text(
                      //           "Histórico",
                      //           style: TextStyle(
                      //             fontSize: 18,
                      //             fontWeight: FontWeight.w600,
                      //             color: Colors.grey,
                      //           ),
                      //         ),
                      //       ),
                      //       Expanded(
                      //         child: Container(
                      //           height: 2,
                      //           decoration: const BoxDecoration(
                      //             gradient: LinearGradient(
                      //               colors: [
                      //                 Colors.transparent,
                      //                 Color(0xFF34495E),
                      //                 Colors.grey,
                      //               ],
                      //             ),
                      //           ),
                      //         ),
                      //       ),
                      //     ],
                      //   ),
                      // ),
                    ],
                  ),
                ),
    );
  }
}