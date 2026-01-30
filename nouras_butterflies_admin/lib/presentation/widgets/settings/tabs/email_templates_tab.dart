import 'package:flutter/material.dart';
import '../../settings_section.dart';
import '../../save_button.dart';
import '../../../../core/constants/app_colors.dart';

class EmailTemplatesTab extends StatefulWidget {
  const EmailTemplatesTab({super.key});

  @override
  State<EmailTemplatesTab> createState() => _EmailTemplatesTabState();
}

class _EmailTemplatesTabState extends State<EmailTemplatesTab> {
  bool _isLoading = false;

  final List<EmailTemplate> _templates = [
    EmailTemplate(
      id: 'order_confirmation',
      name: 'Order Confirmation',
      description: 'Sent to customers when they place an order',
      subject: 'Order Confirmation - #{order_number}',
      lastModified: '2024-01-15',
      isActive: true,
    ),
    EmailTemplate(
      id: 'shipping_notification',
      name: 'Shipping Notification',
      description: 'Sent when order is shipped with tracking details',
      subject: 'Your Order #{order_number} Has Been Shipped!',
      lastModified: '2024-01-14',
      isActive: true,
    ),
    EmailTemplate(
      id: 'welcome_email',
      name: 'Welcome Email',
      description: 'Sent to new customers upon registration',
      subject: 'Welcome to Noura\'s Butterflies!',
      lastModified: '2024-01-10',
      isActive: true,
    ),
    EmailTemplate(
      id: 'password_reset',
      name: 'Password Reset',
      description: 'Sent when customer requests password reset',
      subject: 'Reset Your Password',
      lastModified: '2024-01-08',
      isActive: true,
    ),
    EmailTemplate(
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Monthly newsletter with promotions and updates',
      subject: 'Noura\'s Butterflies Newsletter - #{month}',
      lastModified: '2024-01-01',
      isActive: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Email Templates List
          SettingsSection(
            title: 'Email Templates',
            subtitle: 'Manage your email templates and notifications',
            action: ElevatedButton.icon(
              onPressed: _createNewTemplate,
              icon: const Icon(Icons.add, size: 16),
              label: const Text('New Template'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.adminPrimary,
                foregroundColor: AppColors.surfaceLight,
              ),
            ),
            children: [
              ..._templates.map((template) => _buildTemplateCard(template)),
            ],
          ),
          // Save Button
          const SizedBox(height: 24),
          Row(
            children: [
              const Spacer(),
              SaveButton(
                onPressed: _saveTemplateSettings,
                isLoading: _isLoading,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTemplateCard(EmailTemplate template) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.surfaceDark
            : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Theme.of(context).brightness == Brightness.dark
              ? AppColors.borderDark
              : AppColors.borderLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Template Icon
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _getTemplateColor(template.id).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  _getTemplateIcon(template.id),
                  color: _getTemplateColor(template.id),
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              // Template Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          template.name,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark,
                          ),
                        ),
                        const SizedBox(width: 8),
                        // Active Status Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: template.isActive
                                ? AppColors.success.withOpacity(0.1)
                                : AppColors.gray300.withOpacity(0.3),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            template.isActive ? 'Active' : 'Inactive',
                            style: TextStyle(
                              color: template.isActive ? AppColors.success : AppColors.gray600,
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      template.description,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSoft,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Subject: ${template.subject}',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textSoft.withOpacity(0.7),
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ),
              ),
              // Actions
              Column(
                children: [
                  IconButton(
                    onPressed: () => _editTemplate(template),
                    icon: Icon(
                      Icons.edit,
                      color: AppColors.adminPrimary,
                      size: 20,
                    ),
                    tooltip: 'Edit Template',
                  ),
                  IconButton(
                    onPressed: () => _previewTemplate(template),
                    icon: Icon(
                      Icons.visibility,
                      color: AppColors.info,
                      size: 20,
                    ),
                    tooltip: 'Preview',
                  ),
                  IconButton(
                    onPressed: () => _toggleTemplate(template),
                    icon: Icon(
                      template.isActive ? Icons.toggle_on : Icons.toggle_off,
                      color: template.isActive ? AppColors.success : AppColors.gray400,
                      size: 20,
                    ),
                    tooltip: template.isActive ? 'Deactivate' : 'Activate',
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(
                Icons.schedule,
                size: 14,
                color: AppColors.textSoft,
              ),
              const SizedBox(width: 4),
              Text(
                'Last modified: ${template.lastModified}',
                style: TextStyle(
                  fontSize: 11,
                  color: AppColors.textSoft,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getTemplateColor(String templateId) {
    switch (templateId) {
      case 'order_confirmation':
        return AppColors.success;
      case 'shipping_notification':
        return AppColors.info;
      case 'welcome_email':
        return AppColors.adminGold;
      case 'password_reset':
        return AppColors.warning;
      case 'newsletter':
        return AppColors.adminPrimary;
      default:
        return AppColors.gray500;
    }
  }

  IconData _getTemplateIcon(String templateId) {
    switch (templateId) {
      case 'order_confirmation':
        return Icons.check_circle;
      case 'shipping_notification':
        return Icons.local_shipping;
      case 'welcome_email':
        return Icons.waving_hand;
      case 'password_reset':
        return Icons.lock_reset;
      case 'newsletter':
        return Icons.campaign;
      default:
        return Icons.email;
    }
  }

  void _createNewTemplate() {
    // TODO: Implement create new template
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Create new template functionality coming soon!'),
      ),
    );
  }

  void _editTemplate(EmailTemplate template) {
    // TODO: Implement edit template
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Edit ${template.name} template coming soon!'),
      ),
    );
  }

  void _previewTemplate(EmailTemplate template) {
    // TODO: Implement preview template
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Preview ${template.name} template coming soon!'),
      ),
    );
  }

  void _toggleTemplate(EmailTemplate template) {
    setState(() {
      template.isActive = !template.isActive;
    });
  }

  Future<void> _saveTemplateSettings() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Email template settings saved successfully!'),
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

class EmailTemplate {
  final String id;
  final String name;
  final String description;
  final String subject;
  final String lastModified;
  bool isActive;

  EmailTemplate({
    required this.id,
    required this.name,
    required this.description,
    required this.subject,
    required this.lastModified,
    required this.isActive,
  });
}
