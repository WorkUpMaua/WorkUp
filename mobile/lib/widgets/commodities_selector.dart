import 'package:flutter/material.dart';

class CommoditiesSelector extends StatefulWidget {
  final List<String> selectedQualities;
  final Function(List<String>) onChanged;

  const CommoditiesSelector({
    Key? key,
    required this.selectedQualities,
    required this.onChanged,
  }) : super(key: key);

  @override
  State<CommoditiesSelector> createState() => _CommoditiesSelectorState();
}

class _CommoditiesSelectorState extends State<CommoditiesSelector> {
  final List<String> suggestions = [
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

  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  bool _showSuggestions = false;
  List<String> _filteredSuggestions = [];

  @override
  void initState() {
    super.initState();
    _controller.addListener(_filterSuggestions);
    _focusNode.addListener(() {
      setState(() {
        _showSuggestions = _focusNode.hasFocus;
      });
    });
  }

  void _filterSuggestions() {
    setState(() {
      final query = _controller.text.toLowerCase();
      _filteredSuggestions = suggestions
          .where((s) =>
              s.toLowerCase().contains(query) &&
              !widget.selectedQualities.contains(s))
          .toList();
    });
  }

  void _addQuality(String value) {
    if (suggestions.contains(value) &&
        !widget.selectedQualities.contains(value)) {
      final updated = List<String>.from(widget.selectedQualities)..add(value);
      widget.onChanged(updated);
      _controller.clear();
      setState(() {
        _showSuggestions = false;
      });
    }
  }

  void _removeQuality(String value) {
    final updated = widget.selectedQualities.where((q) => q != value).toList();
    widget.onChanged(updated);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: _controller,
          focusNode: _focusNode,
          decoration: InputDecoration(
            hintText: "Comodidades (ex: Wi-Fi, Ar Condicionado...)",
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          onSubmitted: (value) {
            _addQuality(value);
          },
        ),
        if (_showSuggestions && _filteredSuggestions.isNotEmpty)
          Container(
            margin: const EdgeInsets.only(top: 8),
            constraints: const BoxConstraints(maxHeight: 200),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: _filteredSuggestions.length,
              itemBuilder: (context, index) {
                final suggestion = _filteredSuggestions[index];
                return ListTile(
                  title: Text(suggestion),
                  onTap: () => _addQuality(suggestion),
                  dense: true,
                );
              },
            ),
          ),
        if (widget.selectedQualities.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: widget.selectedQualities.map((quality) {
                return Chip(
                  label: Text(quality),
                  backgroundColor: Colors.blue[50],
                  labelStyle: TextStyle(color: Colors.blue[800]),
                  deleteIcon: const Icon(Icons.close, size: 18),
                  deleteIconColor: Colors.red,
                  onDeleted: () => _removeQuality(quality),
                );
              }).toList(),
            ),
          ),
      ],
    );
  }
}