import 'package:flutter/material.dart';
import 'dart:ui';
import '../screens/user_profile_screen.dart';
import '../screens/login_screen.dart';
import '../screens/create_propriedade_page.dart';
import '../screens/properties_screen.dart';
import '../screens/rent_screen.dart';
import '../screens/home_page.dart';
import '../utils/user_storage.dart';

class SidebarMenu extends StatelessWidget {
  final bool active;
  final VoidCallback onClose;

  const SidebarMenu({Key? key, required this.active, required this.onClose})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Backdrop com blur
        if (active)
          GestureDetector(
            onTap: onClose,
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
              child: Container(color: Colors.black.withOpacity(0.3)),
            ),
          ),

        // Drawer
        AnimatedPositioned(
          duration: const Duration(milliseconds: 300),
          left: active ? 0 : -280,
          top: 0,
          bottom: 0,
          child: Material(
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
                        bottom: BorderSide(
                          color: Colors.white.withOpacity(0.1),
                        ),
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
                            Navigator.pushAndRemoveUntil(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const HomePage(),
                              ),
                              (route) => false,
                            );
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.person,
                          label: 'Perfil',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const UserProfilePage(),
                              ),
                            );
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.calendar_today,
                          label: 'Minhas Reservas',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const TelaAluguelPage(),
                              ),
                            );
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.business,
                          label: 'Gerenciar Propriedades',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const TelaPropriedadePage(),
                              ),
                            );
                            onClose();
                          },
                        ),
                        _buildMenuItem(
                          context,
                          icon: Icons.add_circle,
                          label: 'Criar Sala',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const CreatePropriedadePage(),
                              ),
                            );
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
                                title: const Text(
                                  'Confirmar Logout',
                                  style: TextStyle(
                                    color: Color(0xFF34495E),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                content: const Text(
                                  'Tem certeza que deseja sair da sua conta?',
                                  style: TextStyle(fontSize: 16),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text(
                                      'Cancelar',
                                      style: TextStyle(color: Colors.grey),
                                    ),
                                  ),
                                  TextButton(
                                    onPressed: () {
                                      UserStorage().clearLoggedUser();
                                      Navigator.pop(context);
                                      Navigator.pushAndRemoveUntil(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              const LoginScreen(),
                                        ),
                                        (route) => false,
                                      );
                                    },
                                    child: const Text(
                                      'Sair',
                                      style: TextStyle(
                                        color: Color(0xFF34495E),
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
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
