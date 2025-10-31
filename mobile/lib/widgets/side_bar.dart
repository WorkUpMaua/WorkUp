import 'package:flutter/material.dart';

class SidebarMenu extends StatelessWidget {
  final bool active;
  final VoidCallback onClose;

  const SidebarMenu({
    Key? key,
    required this.active,
    required this.onClose,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Backdrop
        if (active)
          GestureDetector(
            onTap: onClose,
            child: Container(
              color: Colors.black.withOpacity(0.3),
            ),
          ),

        // Drawer
        AnimatedPositioned(
          duration: const Duration(milliseconds: 300),
          left: active ? 0 : -280,
          top: 0,
          bottom: 0,
          child: Material( // <-- Material adicionado aqui
            color: const Color(0xFF34495E),
            elevation: 8,
            child: Container(
              width: 280,
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      border: Border(
                        bottom: BorderSide(color: Colors.white.withOpacity(0.1)),
                      ),
                    ),
                    child: const Center(
                      child: Text(
                        'WorkUp',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: ListView(
                      padding: EdgeInsets.zero,
                      children: [
                        _buildMenuItem(
                          context,
                          icon: Icons.home,
                          label: 'Home',
                          onTap: () {
                            Navigator.pushNamed(context, '/');
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.person,
                          label: 'Perfil',
                          onTap: () {
                            Navigator.pushNamed(context, '/user-profile');
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.calendar_today,
                          label: 'Minhas Reservas',
                          onTap: () {
                            Navigator.pushNamed(context, '/rent');
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.business,
                          label: 'Gerenciar Propriedades',
                          onTap: () {
                            Navigator.pushNamed(context, '/properties');
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.add_circle,
                          label: 'Criar Sala',
                          onTap: () {
                            Navigator.pushNamed(context, '/create-property');
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.exit_to_app,
                          label: 'Sair',
                          onTap: () {
                            showDialog(
                              context: context,
                              builder: (context) => AlertDialog(
                                title: const Text('Confirmar'),
                                content: const Text('Certeza que deseja sair?'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('Cancelar'),
                                  ),
                                  TextButton(
                                    onPressed: () {
                                      // TODO: implementar logout
                                      Navigator.pushReplacementNamed(context, '/login');
                                    },
                                    child: const Text('Sair'),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.white, size: 20),
      title: Text(
        label,
        style: const TextStyle(color: Colors.white, fontSize: 14),
      ),
      onTap: onTap,
      hoverColor: Colors.white.withOpacity(0.1),
    );
  }
}