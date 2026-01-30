import 'package:flutter/material.dart';
import '../../settings_section.dart';
import '../../settings_text_field.dart';
import '../../settings_toggle.dart';
import '../../save_button.dart';
import '../../../../core/constants/app_colors.dart';

class PaymentSettingsTab extends StatefulWidget {
  const PaymentSettingsTab({super.key});

  @override
  State<PaymentSettingsTab> createState() => _PaymentSettingsTabState();
}

class _PaymentSettingsTabState extends State<PaymentSettingsTab> {
  final _stripePublishableKeyController = TextEditingController(text: 'pk_test_...');
  final _stripeSecretKeyController = TextEditingController(text: 'sk_test_...');
  final _stripeWebhookSecretController = TextEditingController(text: 'whsec_...');
  final _paypalClientIdController = TextEditingController(text: '...');
  final _paypalClientSecretController = TextEditingController(text: '...');
  
  bool _stripeEnabled = true;
  bool _paypalEnabled = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _stripePublishableKeyController.dispose();
    _stripeSecretKeyController.dispose();
    _stripeWebhookSecretController.dispose();
    _paypalClientIdController.dispose();
    _paypalClientSecretController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stripe Configuration
          SettingsSection(
            title: 'Stripe Configuration',
            subtitle: 'Configure Stripe payment gateway',
            children: [
              SettingsToggle(
                label: 'Enable Stripe',
                subtitle: 'Accept credit card payments via Stripe',
                value: _stripeEnabled,
                onChanged: (value) {
                  setState(() {
                    _stripeEnabled = value;
                  });
                },
                icon: Icon(Icons.credit_card, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Publishable Key',
                controller: _stripePublishableKeyController,
                obscureText: true,
                enabled: _stripeEnabled,
                required: _stripeEnabled,
                helperText: 'Your Stripe publishable key (starts with pk_)',
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Secret Key',
                controller: _stripeSecretKeyController,
                obscureText: true,
                enabled: _stripeEnabled,
                required: _stripeEnabled,
                helperText: 'Your Stripe secret key (starts with sk_)',
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Webhook Secret',
                controller: _stripeWebhookSecretController,
                obscureText: true,
                enabled: _stripeEnabled,
                helperText: 'Webhook secret for Stripe events',
              ),
            ],
          ),
          // PayPal Configuration
          SettingsSection(
            title: 'PayPal Configuration',
            subtitle: 'Configure PayPal payment gateway',
            children: [
              SettingsToggle(
                label: 'Enable PayPal',
                subtitle: 'Accept PayPal payments',
                value: _paypalEnabled,
                onChanged: (value) {
                  setState(() {
                    _paypalEnabled = value;
                  });
                },
                icon: Icon(Icons.account_balance_wallet, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Client ID',
                controller: _paypalClientIdController,
                obscureText: true,
                enabled: _paypalEnabled,
                required: _paypalEnabled,
                helperText: 'Your PayPal client ID',
              ),
              const SizedBox(height: 16),
              SettingsTextField(
                label: 'Client Secret',
                controller: _paypalClientSecretController,
                obscureText: true,
                enabled: _paypalEnabled,
                required: _paypalEnabled,
                helperText: 'Your PayPal client secret',
              ),
            ],
          ),
          // Payment Settings
          SettingsSection(
            title: 'Payment Settings',
            subtitle: 'General payment configuration',
            children: [
              SettingsToggle(
                label: 'Require CVV',
                subtitle: 'Require CVV code for credit card payments',
                value: true,
                onChanged: (value) {
                  // TODO: Implement CVV requirement
                },
                icon: Icon(Icons.security, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsToggle(
                label: 'Save Payment Methods',
                subtitle: 'Allow customers to save payment methods',
                value: true,
                onChanged: (value) {
                  // TODO: Implement save payment methods
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
                onPressed: _savePaymentSettings,
                isLoading: _isLoading,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _savePaymentSettings() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Payment settings saved successfully!'),
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
