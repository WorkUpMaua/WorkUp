import 'package:flutter/material.dart';

class AlertWidget extends StatelessWidget {
  final String message;
  final String type; // 'success' ou 'error'
  final VoidCallback? onClose;

  const AlertWidget({
    Key? key,
    required this.message,
    required this.type,
    this.onClose,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isError = type == 'error';
    final bgColor = isError ? Colors.red[50] : Colors.green[50];
    final borderColor = isError ? Colors.red[300] : Colors.green[300];
    final iconColor = isError ? Colors.red : Colors.green;
    final textColor = isError ? Colors.red[900] : Colors.green[900];

    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: borderColor!, width: 1),
      ),
      child: Row(
        children: [
          Icon(
            isError ? Icons.error_outline : Icons.check_circle_outline,
            color: iconColor,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                color: textColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          if (onClose != null)
            IconButton(
              onPressed: onClose,
              icon: Icon(Icons.close, size: 20, color: iconColor),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
        ],
      ),
    );
  }
}