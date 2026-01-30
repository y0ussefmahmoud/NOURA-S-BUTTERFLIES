import 'package:flutter/material.dart';
import '../../../data/models/customer.dart';
import '../../../core/constants/app_colors.dart';
import '../common/button.dart';

class CustomersFilterBar extends StatefulWidget {
  final Function(MembershipTier?) onTierFilter;
  final Function(String) onSearch;

  const CustomersFilterBar({
    super.key,
    required this.onTierFilter,
    required this.onSearch,
  });

  @override
  State<CustomersFilterBar> createState() => _CustomersFilterBarState();
}

class _CustomersFilterBarState extends State<CustomersFilterBar> {
  final TextEditingController _searchController = TextEditingController();
  MembershipTier? _selectedTier;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.surfaceDark
            : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).brightness == Brightness.dark
              ? AppColors.borderDark
              : AppColors.borderLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search and Filters Row
          Row(
            children: [
              // Search Bar
              Expanded(
                flex: 2,
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search by name or email...',
                    prefixIcon: Icon(
                      Icons.search,
                      color: AppColors.textSoft,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Theme.of(context).brightness == Brightness.dark
                            ? AppColors.borderDark
                            : AppColors.borderLight,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.adminPrimary),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  onChanged: (value) {
                    widget.onSearch(value);
                  },
                ),
              ),
              const SizedBox(width: 16),
              // Tier Filter
              SizedBox(
                width: 200,
                child: DropdownButtonFormField<MembershipTier>(
                  value: _selectedTier,
                  decoration: InputDecoration(
                    labelText: 'Membership Tier',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Theme.of(context).brightness == Brightness.dark
                            ? AppColors.borderDark
                            : AppColors.borderLight,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.adminPrimary),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  items: [
                    const DropdownMenuItem(
                      value: null,
                      child: Text('All Tiers'),
                    ),
                    ...MembershipTier.values.map((tier) {
                      return DropdownMenuItem(
                        value: tier,
                        child: Row(
                          children: [
                            _buildTierIcon(tier),
                            const SizedBox(width: 8),
                            Text(_getTierText(tier)),
                          ],
                        ),
                      );
                    }),
                  ],
                  onChanged: (tier) {
                    setState(() {
                      _selectedTier = tier;
                    });
                    widget.onTierFilter(tier);
                  },
                ),
              ),
              const SizedBox(width: 16),
              // Action Buttons
              Row(
                children: [
                  Button(
                    text: 'Export',
                    variant: ButtonVariant.outline,
                    onPressed: () {
                      // TODO: Implement export functionality
                    },
                  ),
                  const SizedBox(width: 8),
                  Button(
                    text: 'Bulk Message',
                    variant: ButtonVariant.outline,
                    onPressed: () {
                      // TODO: Implement bulk message functionality
                    },
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Active Filters Row
          Row(
            children: [
              Text(
                'Active Filters:',
                style: TextStyle(
                  color: AppColors.textSoft,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(width: 12),
              if (_selectedTier != null) ...[
                _buildFilterChip(
                  'Tier: ${_getTierText(_selectedTier!)}',
                  () {
                    setState(() {
                      _selectedTier = null;
                    });
                    widget.onTierFilter(null);
                  },
                ),
                const SizedBox(width: 8),
              ],
              if (_searchController.text.isNotEmpty) ...[
                _buildFilterChip(
                  'Search: ${_searchController.text}',
                  () {
                    _searchController.clear();
                    widget.onSearch('');
                  },
                ),
              ],
              const Spacer(),
              // Clear All Filters
              if (_hasActiveFilters())
                TextButton(
                  onPressed: _clearAllFilters,
                  child: Text(
                    'Clear All',
                    style: TextStyle(
                      color: AppColors.adminCoral,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTierIcon(MembershipTier tier) {
    IconData icon;
    Color color;

    switch (tier) {
      case MembershipTier.bronze:
        icon = Icons.military_tech;
        color = AppColors.gray600;
        break;
      case MembershipTier.silver:
        icon = Icons.workspace_premium;
        color = AppColors.gray400;
        break;
      case MembershipTier.gold:
        icon = Icons.star;
        color = AppColors.adminGold;
        break;
      case MembershipTier.platinum:
        icon = Icons.diamond;
        color = AppColors.adminPrimary;
        break;
    }

    return Icon(icon, size: 16, color: color);
  }

  String _getTierText(MembershipTier tier) {
    switch (tier) {
      case MembershipTier.bronze:
        return 'Bronze';
      case MembershipTier.silver:
        return 'Silver';
      case MembershipTier.gold:
        return 'Gold';
      case MembershipTier.platinum:
        return 'Platinum';
    }
  }

  Widget _buildFilterChip(String label, VoidCallback onRemove) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.adminPrimary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppColors.adminPrimary.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: TextStyle(
              color: AppColors.adminPrimary,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 6),
          InkWell(
            onTap: onRemove,
            child: Icon(
              Icons.close,
              size: 14,
              color: AppColors.adminPrimary,
            ),
          ),
        ],
      ),
    );
  }

  bool _hasActiveFilters() {
    return _selectedTier != null || _searchController.text.isNotEmpty;
  }

  void _clearAllFilters() {
    setState(() {
      _searchController.clear();
      _selectedTier = null;
    });
    widget.onSearch('');
    widget.onTierFilter(null);
  }
}
