class Listing {
  final String id;
  final String name;
  final String address;
  final List<String> comodities;
  final List<String> pictures;
  final double price;
  final int capacity;

  Listing({
    required this.id,
    required this.name,
    required this.address,
    required this.comodities,
    required this.pictures,
    required this.price,
    required this.capacity,
  });

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      comodities: List<String>.from(json['comodities'] ?? []),
      pictures: List<String>.from(json['pictures'] ?? []),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      capacity: json['capacity'] ?? 0,
    );
  }
}