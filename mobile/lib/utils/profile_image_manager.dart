import 'dart:io';
import 'package:flutter/material.dart';

class ProfileImageManager extends ChangeNotifier {
  static final ProfileImageManager _instance = ProfileImageManager._internal();
  factory ProfileImageManager() => _instance;
  ProfileImageManager._internal();

  File? _profileImage;
  File? get profileImage => _profileImage;

  void setProfileImage(File image) {
    _profileImage = image;
    notifyListeners();
  }

  void clearProfileImage() {
    _profileImage = null;
    notifyListeners();
  }
}
