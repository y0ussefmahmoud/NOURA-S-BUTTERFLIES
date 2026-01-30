import 'package:flutter/material.dart';
import '../../settings_section.dart';
import '../../settings_text_field.dart';
import '../../settings_toggle.dart';
import '../../save_button.dart';
import '../../../../core/constants/app_colors.dart';

class ShippingSettingsTab extends StatefulWidget {
  const ShippingSettingsTab({super.key});

  @override
  State<ShippingSettingsTab> createState() => _ShippingSettingsTabState();
}

class _ShippingSettingsTabState extends State<ShippingSettingsTab> {
  final _freeShippingThresholdController = TextEditingController(text: '100.00');
  final _flatRateController = TextEditingController(text: '10.00');
  final _domesticController = TextEditingController(text: '15.00');
  final _internationalController = TextEditingController(text: '35.00');
  
  bool _freeShippingEnabled = true;
  bool _flatRateEnabled = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _freeShippingThresholdController.dispose();
    _flatRateController.dispose();
    _domesticController.dispose();
    _internationalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Free Shipping
          SettingsSection(
            title: 'Free Shipping',
            subtitle: 'Configure free shipping options',
            children: [
              SettingsToggle(
                label: 'Enable Free Shipping',
                subtitle: 'Offer free shipping for orders above a threshold',
                value: _freeShippingEnabled,
                onChanged: (value) {
                  setState(() {
                    _freeShippingEnabled = value;
                  });
                },
                icon: Icon(Icons.local_shipping, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Free Shipping Threshold',
                controller: _freeShippingThresholdController,
                keyboardType: TextInputType.number,
                enabled: _freeShippingEnabled,
                required: _freeShippingEnabled,
                helperText: 'Minimum order amount for free shipping',
                prefixIcon: Icon(Icons.attach_money, color: AppColors.adminPrimary),
              ),
            ],
          ),
          // Flat Rate Shipping
          SettingsSection(
            title: 'Flat Rate Shipping',
            subtitle: 'Configure flat rate shipping options',
            children: [
              SettingsToggle(
                label: 'Enable Flat Rate',
                subtitle: 'Offer flat rate shipping for all orders',
                value: _flatRateEnabled,
                onChanged: (value) {
                  setState(() {
                    _flatRateEnabled = value;
                  });
                },
                icon: Icon(Icons.price_check, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Flat Rate Price',
                controller: _flatRateController,
                keyboardType: TextInputType.number,
                enabled: _flatRateEnabled,
                required: _flatRateEnabled,
                helperText: 'Flat rate shipping price',
                prefixIcon: Icon(Icons.attach_money, color: AppColors.adminPrimary),
              ),
            ],
          ),
          // Shipping Zones
          SettingsSection(
            title: 'Shipping Zones',
            subtitle: 'Configure shipping rates by region',
            children: [
              // Domestic Shipping
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.adminPrimary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: AppColors.adminPrimary.withOpacity(0.2),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.home, color: AppColors.adminPrimary),
                        const SizedBox(width: 8),
                        Text(
                          'Domestic Shipping',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.adminPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SettingsTextField(
                      label: 'Domestic Rate',
                      controller: _domesticController,
                      keyboardType: TextInputType.number,
                      helperText: 'Shipping rate for domestic orders',
                      prefixIcon: Icon(Icons.attach_money, color: AppColors.adminPrimary),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // International Shipping
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.adminGold.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: AppColors.adminGold.withOpacity(0.2),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.public, color: AppColors.adminGold),
                        const SizedBox(width: 8),
                        Text(
                          'International Shipping',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.adminGold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SettingsTextField(
                      label: 'International Rate',
                      controller: _internationalController,
                      keyboardType: TextInputType.number,
                      helperText: 'Shipping rate for international orders',
                      prefixIcon: Icon(Icons.attach_money, color: AppColors.adminGold),
                    ),
                  ],
                ),
              ),
            ],
          ),
          // Additional Settings
          SettingsSection(
            title: 'Additional Settings',
            subtitle: 'Other shipping configuration options',
            children: [
              SettingsToggle(
                label: 'Order Tracking',
                subtitle: 'Enable order tracking for customers',
                value: true,
                onChanged: (value) {
                  // TODO: Implement order tracking
                },
                icon: Icon(Icons.gps_fixed, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsToggle(
                label: 'Express Shipping',
                subtitle: 'Offer express shipping options',
                value: false,
                onChanged: (value) {
                  // TODO: Implement express shipping
                },
              ),
            ],
          ),
          // Save Button
          const SizedBox(height: 24),
          Row(
            children: [
              const Spacer(),
              SaveButton(
                onPressed: _saveShippingSettings,
                isLoading: _isLoading,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _saveShippingSettings() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Shipping settings saved successfully!'),
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
