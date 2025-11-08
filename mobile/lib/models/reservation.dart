class Reservation {
  final String id;
  final String userId;
  final String workspaceId;
  final int startDate;
  final int endDate;
  final int people;
  final double finalPrice;
  final String status;
  final String? doorCode;
  final int createdAt;
  final int updatedAt;

  const Reservation({
    required this.id,
    required this.userId,
    required this.workspaceId,
    required this.startDate,
    required this.endDate,
    required this.people,
    required this.finalPrice,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    this.doorCode,
  });

  factory Reservation.fromJson(Map<String, dynamic> json) {
    return Reservation(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      workspaceId: json['workspaceId']?.toString() ?? '',
      startDate: (json['startDate'] as num?)?.toInt() ?? 0,
      endDate: (json['endDate'] as num?)?.toInt() ?? 0,
      people: (json['people'] as num?)?.toInt() ?? 0,
      finalPrice: (json['finalPrice'] as num?)?.toDouble() ?? 0.0,
      status: json['status']?.toString() ?? '',
      doorCode: json['doorCode']?.toString(),
      createdAt: (json['createdAt'] as num?)?.toInt() ?? 0,
      updatedAt: (json['updatedAt'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'workspaceId': workspaceId,
      'startDate': startDate,
      'endDate': endDate,
      'people': people,
      'finalPrice': finalPrice,
      'status': status,
      'doorCode': doorCode,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  DateTime get startDateTime => DateTime.fromMillisecondsSinceEpoch(startDate);

  DateTime get endDateTime => DateTime.fromMillisecondsSinceEpoch(endDate);
}
