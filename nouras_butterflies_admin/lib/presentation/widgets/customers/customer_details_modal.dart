import 'package:flutter/material.dart';
import '../../../data/models/customer.dart';
import '../../../core/constants/app_colors.dart';
import '../common/button.dart';

class CustomerDetailsModal extends StatefulWidget {
  final Customer customer;
  final Function(String) onNotesUpdate;

  const CustomerDetailsModal({
    super.key,
    required this.customer,
    required this.onNotesUpdate,
  });

  @override
  State<CustomerDetailsModal> createState() => _CustomerDetailsModalState();
}

class _CustomerDetailsModalState extends State<CustomerDetailsModal>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late TextEditingController _notesController;
  bool _notesChanged = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _scaleAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
    _animationController.forward();
    _notesController = TextEditingController(text: widget.customer.adminNotes ?? '');
    _notesController.addListener(() {
      setState(() {
        _notesChanged = _notesController.text != (widget.customer.adminNotes ?? '');
      });
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          width: MediaQuery.of(context).size.width * 0.8,
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: BoxDecoration(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.surfaceDark
                : AppColors.surfaceLight,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.borderDark
                  : AppColors.borderLight,
            ),
          ),
          child: Column(
            children: [
              // Header
              _buildHeader(),
              // Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stats Grid
                      _buildStatsGrid(),
                      const SizedBox(height: 24),
                      // Communication Preferences
                      _buildCommunicationPreferences(),
                      const SizedBox(height: 24),
                      // Customer Tags
                      _buildCustomerTags(),
                      const SizedBox(height: 24),
                      // Admin Notes
                      _buildAdminNotes(),
                    ],
                  ),
                ),
              ),
              // Footer Actions
              _buildFooterActions(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.adminPrimary.withOpacity(0.05),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.borderDark
                : AppColors.borderLight,
          ),
        ),
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: _getTierColor(widget.customer.tier).withOpacity(0.1),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(
                color: _getTierColor(widget.customer.tier).withOpacity(0.3),
                width: 2,
              ),
            ),
            child: widget.customer.avatar != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(30),
                    child: Image.network(
                      widget.customer.avatar!,
                      width: 60,
                      height: 60,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Icon(
                          Icons.person,
                          color: _getTierColor(widget.customer.tier),
                          size: 30,
                        );
                      },
                    ),
                  )
                : Icon(
                    Icons.person,
                    color: _getTierColor(widget.customer.tier),
                    size: 30,
                  ),
          ),
          const SizedBox(width: 16),
          // Customer Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.customer.fullName,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppColors.adminPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.customer.email,
                  style: TextStyle(
                    color: AppColors.textSoft,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.customer.phone,
                  style: TextStyle(
                    color: AppColors.textSoft,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          // Membership Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: _getTierColor(widget.customer.tier).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: _getTierColor(widget.customer.tier).withOpacity(0.3),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _getTierIcon(widget.customer.tier),
                  size: 16,
                  color: _getTierColor(widget.customer.tier),
                ),
                const SizedBox(width: 6),
                Text(
                  _getTierText(widget.customer.tier),
                  style: TextStyle(
                    color: _getTierColor(widget.customer.tier),
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          IconButton(
            onPressed: () => Navigator.of(context).pop(),
            icon: Icon(
              Icons.close,
              color: AppColors.textSoft,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Customer Statistics',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 4,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 1.5,
          children: [
            _buildStatCard(
              'Total Orders',
              '${widget.customer.totalOrders}',
              Icons.shopping_bag,
              AppColors.adminPrimary,
            ),
            _buildStatCard(
              'Total Spent',
              widget.customer.formattedTotalSpent,
              Icons.attach_money,
              AppColors.adminGold,
            ),
            _buildStatCard(
              'Loyalty Points',
              '${widget.customer.loyaltyPoints}',
              Icons.star,
              AppColors.adminSage,
            ),
            _buildStatCard(
              'Member Since',
              widget.customer.formattedJoinDate,
              Icons.calendar_today,
              AppColors.adminCoral,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            color: color,
            size: 20,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 10,
              color: AppColors.textSoft,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCommunicationPreferences() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.gray800.withOpacity(0.3)
            : AppColors.gray50,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Communication Preferences',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildPreferenceToggle(
                  'Newsletter',
                  widget.customer.preferences.newsletter,
                  Icons.email,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildPreferenceToggle(
                  'SMS',
                  widget.customer.preferences.sms,
                  Icons.sms,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildPreferenceToggle(
                  'Promotions',
                  widget.customer.preferences.promotions,
                  Icons.local_offer,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildPreferenceToggle(
                  'New Products',
                  widget.customer.preferences.newProducts,
                  Icons.new_releases,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPreferenceToggle(String label, bool value, IconData icon) {
    return Row(
      children: [
        Icon(
          icon,
          size: 20,
          color: value ? AppColors.success : AppColors.gray400,
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: TextStyle(
            color: value ? AppColors.textDark : AppColors.textSoft,
            fontWeight: value ? FontWeight.w500 : FontWeight.normal,
          ),
        ),
        const SizedBox(width: 8),
        Icon(
          value ? Icons.check_circle : Icons.cancel,
          size: 16,
          color: value ? AppColors.success : AppColors.gray400,
        ),
      ],
    );
  }

  Widget _buildCustomerTags() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.adminGold.withOpacity(0.1)
            : AppColors.adminGold.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Customer Tags',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
          if (widget.customer.tags.isEmpty)
            Text(
              'No tags assigned',
              style: TextStyle(
                color: AppColors.textSoft.withOpacity(0.7),
              ),
            )
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: widget.customer.tags.map((tag) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getTagColor(tag).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: _getTagColor(tag).withOpacity(0.3),
                    ),
                  ),
                  child: Text(
                    tag,
                    style: TextStyle(
                      color: _getTagColor(tag),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildAdminNotes() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.adminCoral.withOpacity(0.1)
            : AppColors.adminCoral.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Admin Notes',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                ),
              ),
              if (_notesChanged) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Unsaved',
                    style: TextStyle(
                      color: AppColors.warning,
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _notesController,
            maxLines: 4,
            decoration: InputDecoration(
              hintText: 'Add notes about this customer...',
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
                borderSide: const BorderSide(color: AppColors.adminCoral),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooterActions() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.gray800.withOpacity(0.3)
            : AppColors.gray50,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        border: Border(
          top: BorderSide(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.borderDark
                : AppColors.borderLight,
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Button(
              text: 'Send Message',
              variant: ButtonVariant.outline,
              onPressed: () {
                // TODO: Implement message functionality
              },
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Button(
              text: 'View Orders',
              variant: ButtonVariant.outline,
              onPressed: () {
                // TODO: Navigate to customer orders
              },
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Button(
              text: _notesChanged ? 'Save Notes' : 'Close',
              variant: _notesChanged ? ButtonVariant.primary : ButtonVariant.outline,
              onPressed: () {
                if (_notesChanged) {
                  widget.onNotesUpdate(_notesController.text);
                }
                Navigator.of(context).pop();
              },
            ),
          ),
        ],
      ),
    );
  }

  Color _getTierColor(MembershipTier tier) {
    switch (tier) {
      case MembershipTier.bronze:
        return AppColors.gray600;
      case MembershipTier.silver:
        return AppColors.gray400;
      case MembershipTier.gold:
        return AppColors.adminGold;
      case MembershipTier.platinum:
        return AppColors.adminPrimary;
    }
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

  IconData _getTierIcon(MembershipTier tier) {
    switch (tier) {
      case MembershipTier.bronze:
        return Icons.military_tech;
      case MembershipTier.silver:
        return Icons.workspace_premium;
      case MembershipTier.gold:
        return Icons.star;
      case MembershipTier.platinum:
        return Icons.diamond;
    }
  }

  Color _getTagColor(String tag) {
    switch (tag.toLowerCase()) {
      case 'vip':
        return AppColors.adminGold;
      case 'new customer':
        return AppColors.success;
      case 'repeat customer':
        return AppColors.info;
      case 'wholesale':
        return AppColors.adminPrimary;
      case 'premium':
        return AppColors.adminCoral;
      case 'growing customer':
        return AppColors.adminSage;
      case 'loyal':
        return AppColors.warning;
      default:
        return AppColors.gray500;
    }
  }
}
