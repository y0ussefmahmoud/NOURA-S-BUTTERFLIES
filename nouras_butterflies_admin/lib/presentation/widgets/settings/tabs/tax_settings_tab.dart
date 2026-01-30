import 'package:flutter/material.dart';
import '../../settings_section.dart';
import '../../settings_text_field.dart';
import '../../settings_dropdown.dart';
import '../../settings_toggle.dart';
import '../../save_button.dart';
import '../../../../core/constants/app_colors.dart';

class TaxSettingsTab extends StatefulWidget {
  const TaxSettingsTab({super.key});

  @override
  State<TaxSettingsTab> createState() => _TaxSettingsTabState();
}

class _TaxSettingsTabState extends State<TaxSettingsTab> {
  final _taxRateController = TextEditingController(text: '8.5');
  String _calculationMethod = 'inclusive';
  bool _isLoading = false;
  
  final List<String> _regions = [
    'United States',
    'Canada',
    'United Kingdom',
    'European Union',
    'Australia',
    'Other',
  ];
  
  final Set<String> _selectedRegions = {'United States', 'Canada'};

  @override
  void dispose() {
    _taxRateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Tax Configuration
          SettingsSection(
            title: 'Tax Configuration',
            subtitle: 'Configure your tax settings and rates',
            children: [
              SettingsTextField(
                label: 'Tax Rate (%)',
                controller: _taxRateController,
                keyboardType: TextInputType.number,
                helperText: 'Default tax rate for all products',
                prefixIcon: Icon(Icons.percent, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsDropdown<String>(
                label: 'Tax Calculation Method',
                value: _calculationMethod,
                items: const [
                  DropdownMenuItem(
                    value: 'inclusive',
                    child: Text('Inclusive (Tax included in price)'),
                  ),
                  DropdownMenuItem(
                    value: 'exclusive',
                    child: Text('Exclusive (Tax added to price)'),
                  ),
                ],
                onChanged: (value) {
                  setState(() {
                    _calculationMethod = value!;
                  });
                },
                prefixIcon: Icon(Icons.calculate, color: AppColors.adminPrimary),
              ),
            ],
          ),
          // Tax Regions
          SettingsSection(
            title: 'Tax Regions',
            subtitle: 'Select regions where tax should be applied',
            children: [
              Text(
                'Select the regions where you need to collect tax:',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSoft,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _regions.map((region) {
                  final isSelected = _selectedRegions.contains(region);
                  return FilterChip(
                    label: Text(region),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _selectedRegions.add(region);
                        } else {
                          _selectedRegions.remove(region);
                        }
                      });
                    },
                    backgroundColor: AppColors.gray100,
                    selectedColor: AppColors.adminPrimary.withOpacity(0.2),
                    checkmarkColor: AppColors.adminPrimary,
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.adminPrimary : AppColors.textDark,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              Text(
                '${_selectedRegions.length} region${_selectedRegions.length == 1 ? '' : 's'} selected',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSoft,
                ),
              ),
            ],
          ),
          // Advanced Tax Settings
          SettingsSection(
            title: 'Advanced Settings',
            subtitle: 'Additional tax configuration options',
            children: [
              SettingsToggle(
                label: 'Tax Exempt Customers',
                subtitle: 'Allow tax-exempt status for eligible customers',
                value: true,
                onChanged: (value) {
                  // TODO: Implement tax exempt functionality
                },
                icon: Icon(Icons.person_off, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsToggle(
                label: 'Digital Products Tax',
                subtitle: 'Apply different tax rates for digital products',
                value: false,
                onChanged: (value) {
                  // TODO: Implement digital products tax
                },
              ),
              const SizedBox(height: 16),
              SettingsToggle(
                label: 'Tax Reporting',
                subtitle: 'Generate detailed tax reports',
                value: true,
                onChanged: (value) {
                  // TODO: Implement tax reporting
                },
                icon: Icon(Icons.analytics, color: AppColors.adminPrimary),
              ),
            ],
          ),
          // Tax Summary
          SettingsSection(
            title: 'Tax Summary',
            subtitle: 'Current tax configuration overview',
            children: [
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
                        Icon(Icons.info_outline, color: AppColors.adminPrimary),
                        const SizedBox(width: 8),
                        Text(
                          'Current Configuration',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.adminPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildSummaryRow('Tax Rate', '${_taxRateController.text}%'),
                    _buildSummaryRow('Calculation Method', _getCalculationMethodText()),
                    _buildSummaryRow('Active Regions', '${_selectedRegions.length} regions'),
                    _buildSummaryRow('Tax Exempt', 'Enabled'),
                  ],
                ),
              ),
            ],
          ),
          // Save Button
          const SizedBox(height: 24),
          Row(
            children: [
              const Spacer(),
              SaveButton(
                onPressed: _saveTaxSettings,
                isLoading: _isLoading,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: AppColors.textSoft,
              fontSize: 14,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: AppColors.textDark,
              fontWeight: FontWeight.w500,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  String _getCalculationMethodText() {
    switch (_calculationMethod) {
      case 'inclusive':
        return 'Tax Included';
      case 'exclusive':
        return 'Tax Added';
      default:
        return 'Unknown';
    }
  }

  Future<void> _saveTaxSettings() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Tax settings saved successfully!'),
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
