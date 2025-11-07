class Aluguel {
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

  Aluguel({
    required this.id,
    required this.userId,
    required this.workspaceId,
    required this.startDate,
    required this.endDate,
    required this.people,
    required this.finalPrice,
    required this.status,
    this.doorCode,
    required this.createdAt,
    required this.updatedAt,
  });

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
}
