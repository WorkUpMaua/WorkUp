import 'package:flutter/material.dart';
import '../screens/user_profile_screen.dart';
import '../utils/profile_image_manager.dart';

class HeaderBar extends StatefulWidget implements PreferredSizeWidget {
  final VoidCallback onMenuClick;

  const HeaderBar({Key? key, required this.onMenuClick}) : super(key: key);

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  State<HeaderBar> createState() => _HeaderBarState();
}

class _HeaderBarState extends State<HeaderBar> {
  @override
  void initState() {
    super.initState();
    ProfileImageManager().addListener(_onProfileImageChanged);
  }

  @override
  void dispose() {
    ProfileImageManager().removeListener(_onProfileImageChanged);
    super.dispose();
  }

  void _onProfileImageChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final profileImage = ProfileImageManager().profileImage;

    return AppBar(
      backgroundColor: const Color(0xFF34495E),
      leading: IconButton(
        icon: const Icon(Icons.menu, color: Colors.white),
        onPressed: widget.onMenuClick,
      ),
      title: Image.asset(
        'assets/logo_WorkUp.png',
        height: 40,
        fit: BoxFit.contain,
      ),
      centerTitle: true,
      elevation: 3,
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 8.0),
          child: GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const UserProfilePage(),
                ),
              );
            },
            child: CircleAvatar(
              radius: 18,
              backgroundColor: Colors.grey[300],
              backgroundImage: profileImage != null
                  ? FileImage(profileImage)
                  : null,
              child: profileImage == null
                  ? const Icon(Icons.person_outline, color: Colors.white)
                  : null,
            ),
          ),
        ),
      ],
    );
  }
}
