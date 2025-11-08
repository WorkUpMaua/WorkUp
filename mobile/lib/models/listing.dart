class Listing {
  final String id;
  final String name;
  final String description;
  final String address;
  final List<String> comodities;
  final List<String> pictures;
  final double price;
  final int capacity;
  final String? doorSerial;

  const Listing({
    required this.id,
    required this.name,
    required this.description,
    required this.address,
    required this.comodities,
    required this.pictures,
    required this.price,
    required this.capacity,
    this.doorSerial,
  });

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      address: json['address'] ?? '',
      comodities: List<String>.from(json['comodities'] ?? []),
      pictures: List<String>.from(json['pictures'] ?? []),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      capacity: (json['capacity'] as num?)?.toInt() ?? 0,
      doorSerial: json['doorSerial']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'address': address,
      'comodities': comodities,
      'pictures': pictures,
      'price': price,
      'capacity': capacity,
      'doorSerial': doorSerial,
    };
  }

  Listing copyWith({
    String? id,
    String? name,
    String? description,
    String? address,
    List<String>? comodities,
    List<String>? pictures,
    double? price,
    int? capacity,
    String? doorSerial,
  }) {
    return Listing(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      address: address ?? this.address,
      comodities: comodities ?? this.comodities,
      pictures: pictures ?? this.pictures,
      price: price ?? this.price,
      capacity: capacity ?? this.capacity,
      doorSerial: doorSerial ?? this.doorSerial,
    );
  }
}
