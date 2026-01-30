import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class AdminAppBar extends StatefulWidget {
  final VoidCallback? onMenuTap;

  const AdminAppBar({
    Key? key,
    this.onMenuTap,
  }) : super(key: key);

  @override
  State<AdminAppBar> createState() => _AdminAppBarState();
}

class _AdminAppBarState extends State<AdminAppBar> {
  final TextEditingController _searchController = TextEditingController();
  bool _hasUnreadNotifications = true;
  int _unreadCount = 3;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 1024;

    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: AppColors.surfaceLight.withOpacity(0.8),
        border: Border(
          bottom: BorderSide(
            color: AppColors.primary.withOpacity(0.1),
            width: 1,
          ),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Row(
          children: [
            if (isMobile) ...[
              IconButton(
                onPressed: widget.onMenuTap,
                icon: const Icon(Icons.menu, color: AppColors.adminPrimary),
              ),
              const SizedBox(width: 16),
            ],
            Expanded(
              child: _buildSearchBar(),
            ),
            const SizedBox(width: 24),
            _buildNotificationButton(),
            const SizedBox(width: 16),
            _buildDarkModeToggle(),
            const SizedBox(width: 16),
            _buildProfileDropdown(),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      constraints: const BoxConstraints(maxWidth: 400),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Search products, orders, customers...',
          prefixIcon: const Icon(Icons.search, color: Colors.grey),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  onPressed: () => _searchController.clear(),
                  icon: const Icon(Icons.clear, color: Colors.grey),
                )
              : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
        onChanged: (value) {
          setState(() {});
        },
      ),
    );
  }

  Widget _buildNotificationButton() {
    return PopupMenuButton<String>(
      icon: Badge(
        isLabelVisible: _hasUnreadNotifications,
        label: Text('$_unreadCount'),
        child: const Icon(Icons.notifications, color: AppColors.adminPrimary),
      ),
      onSelected: (value) {
        switch (value) {
          case 'view_all':
            // Navigate to notifications page
            break;
        }
      },
      itemBuilder: (context) => [
        PopupMenuItem<String>(
          enabled: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Notifications',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  if (_hasUnreadNotifications)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '$_unreadCount new',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                ],
              ),
              const Divider(),
            ],
          ),
        ),
        const PopupMenuItem<String>(
          enabled: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'New order received',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              Text(
                'Order #12345 has been placed',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              Text(
                '2 minutes ago',
                style: TextStyle(fontSize: 11, color: Colors.grey),
              ),
            ],
          ),
        ),
        const PopupMenuItem<String>(
          enabled: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Low stock alert',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              Text(
                'Product "Butterfly Necklace" is running low',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              Text(
                '1 hour ago',
                style: TextStyle(fontSize: 11, color: Colors.grey),
              ),
            ],
          ),
        ),
        const PopupMenuItem<String>(
          value: 'view_all',
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('View all notifications'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDarkModeToggle() {
    return IconButton(
      onPressed: () {
        // Toggle dark mode
      },
      icon: const Icon(Icons.light_mode, color: AppColors.adminPrimary),
    );
  }

  Widget _buildProfileDropdown() {
    return PopupMenuButton<String>(
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(8),
        child: Row(
          children: [
            const Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Admin User',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
                Text(
                  'Administrator',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
            const SizedBox(width: 12),
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.adminPrimary,
              child: const Icon(
                Icons.person,
                color: Colors.white,
                size: 18,
              ),
            ),
          ],
        ),
      ),
      onSelected: (value) {
        switch (value) {
          case 'profile':
            // Navigate to profile
            break;
          case 'settings':
            // Navigate to settings
            break;
          case 'signout':
            // Sign out
            break;
        }
      },
      itemBuilder: (context) => [
        PopupMenuItem<String>(
          enabled: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Admin User',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              const Text(
                'admin@nourasbutterflies.com',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              Container(
                margin: const EdgeInsets.only(top: 4),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.adminGold,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Administrator',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const Divider(),
            ],
          ),
        ),
        const PopupMenuItem<String>(
          value: 'profile',
          child: Row(
            children: [
              Icon(Icons.person, size: 20),
              SizedBox(width: 12),
              Text('Profile'),
            ],
          ),
        ),
        const PopupMenuItem<String>(
          value: 'settings',
          child: Row(
            children: [
              Icon(Icons.settings, size: 20),
              SizedBox(width: 12),
              Text('Settings'),
            ],
          ),
        ),
        const PopupMenuItem<String>(
          value: 'signout',
          child: Row(
            children: [
              Icon(Icons.logout, size: 20),
              SizedBox(width: 12),
              Text('Sign out'),
            ],
          ),
        ),
      ],
    );
  }
}
