import 'package:flutter/material.dart';

class CommoditiesSelector extends StatelessWidget {
  final List<String> selectedQualities;
  final Function(List<String>) onChanged;

  const CommoditiesSelector({
    Key? key,
    required this.selectedQualities,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<String> comodidadesDisponiveis = [
    "Wi-Fi",
    "Ar Condicionado",
    "Cozinha",
    "Estacionamento",
    "Cafeteria",
    "Sala de Reuniões",
    "Projetor",
    "Lousa",
    "Varanda",
    "Limpeza Diária"
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: comodidadesDisponiveis.map((comodidade) {
        final isSelected = selectedQualities.contains(comodidade);
        return FilterChip(
          label: Text(comodidade),
          selected: isSelected,
          selectedColor: Colors.blue[100],
          onSelected: (selected) {
            final newList = List<String>.from(selectedQualities);
            if (selected) {
              newList.add(comodidade);
            } else {
              newList.remove(comodidade);
            }
            onChanged(newList);
          },
        );
      }).toList(),
    );
  }
}
