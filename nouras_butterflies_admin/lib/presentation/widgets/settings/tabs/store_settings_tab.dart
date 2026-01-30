import 'package:flutter/material.dart';
import '../../settings_section.dart';
import '../../settings_text_field.dart';
import '../../save_button.dart';
import '../../../../core/constants/app_colors.dart';

class StoreSettingsTab extends StatefulWidget {
  const StoreSettingsTab({super.key});

  @override
  State<StoreSettingsTab> createState() => _StoreSettingsTabState();
}

class _StoreSettingsTabState extends State<StoreSettingsTab> {
  final _storeNameController = TextEditingController(text: 'Noura\'s Butterflies');
  final _storeEmailController = TextEditingController(text: 'info@nourasbutterflies.com');
  final _storePhoneController = TextEditingController(text: '+1 555-0123');
  final _storeAddressController = TextEditingController(text: '123 Butterfly Lane, Beauty City, BC 12345');
  final _facebookController = TextEditingController(text: 'https://facebook.com/nourasbutterflies');
  final _instagramController = TextEditingController(text: 'https://instagram.com/nourasbutterflies');
  final _twitterController = TextEditingController(text: 'https://twitter.com/nourasbutterflies');
  bool _isLoading = false;

  @override
  void dispose() {
    _storeNameController.dispose();
    _storeEmailController.dispose();
    _storePhoneController.dispose();
    _storeAddressController.dispose();
    _facebookController.dispose();
    _instagramController.dispose();
    _twitterController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Basic Information
          SettingsSection(
            title: 'Basic Information',
            subtitle: 'Configure your store\'s basic details',
            children: [
              SettingsTextField(
                label: 'Store Name',
                controller: _storeNameController,
                required: true,
                prefixIcon: Icon(Icons.store, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Store Email',
                controller: _storeEmailController,
                keyboardType: TextInputType.emailAddress,
                required: true,
                prefixIcon: Icon(Icons.email, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Store Phone',
                controller: _storePhoneController,
                keyboardType: TextInputType.phone,
                prefixIcon: Icon(Icons.phone, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Store Address',
                controller: _storeAddressController,
                maxLines: 2,
                prefixIcon: Icon(Icons.location_on, color: AppColors.adminPrimary),
              ),
            ],
          ),
          // Social Media Links
          SettingsSection(
            title: 'Social Media Links',
            subtitle: 'Connect your social media profiles',
            children: [
              SettingsTextField(
                label: 'Facebook',
                controller: _facebookController,
                keyboardType: TextInputType.url,
                hint: 'https://facebook.com/yourstore',
                prefixIcon: Icon(Icons.facebook, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Instagram',
                controller: _instagramController,
                keyboardType: TextInputType.url,
                hint: 'https://instagram.com/yourstore',
                prefixIcon: Icon(Icons.camera_alt, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Twitter',
                controller: _twitterController,
                keyboardType: TextInputType.url,
                hint: 'https://twitter.com/yourstore',
                prefixIcon: Icon(Icons.alternate_email, color: AppColors.adminPrimary),
              ),
            ],
          ),
          // Save Button
          const SizedBox(height: 24),
          Row(
            children: [
              const Spacer(),
              SaveButton(
                onPressed: _saveStoreSettings,
                isLoading: _isLoading,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _saveStoreSettings() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Store settings saved successfully!'),
            backgroundColor: AppColors.success,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error saving settings: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
}
