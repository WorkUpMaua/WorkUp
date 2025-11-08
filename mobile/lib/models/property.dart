class Property {
  final String id;
  final String name;
  final double price;
  final List<String> images;
  final String address;
  final String description;
  final double? rating;
  final int? reviewCount;
  final List<String> amenities;

  Property({
    required this.id,
    required this.name,
    required this.price,
    this.images = const [],
    this.address = '',
    this.description = '',
    this.rating,
    this.reviewCount,
    this.amenities = const [],
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : 0.0,
      images:
          (json['images'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      address: json['address'] ?? '',
      description: json['description'] ?? '',
      rating: json['rating'] != null
          ? (json['rating'] as num).toDouble()
          : null,
      reviewCount: json['reviewCount'] is int
          ? json['reviewCount'] as int
          : (json['reviewCount'] is num
                ? (json['reviewCount'] as num).toInt()
                : null),
      amenities:
          (json['amenities'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
    );
  }
}
