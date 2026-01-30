import 'package:flutter/material.dart';
import '../../settings_section.dart';
import '../../settings_text_field.dart';
import '../../settings_dropdown.dart';
import '../../save_button.dart';
import '../../../../core/constants/app_colors.dart';

class UserManagementTab extends StatefulWidget {
  const UserManagementTab({super.key});

  @override
  State<UserManagementTab> createState() => _UserManagementTabState();
}

class _UserManagementTabState extends State<UserManagementTab> {
  final _emailController = TextEditingController();
  String _selectedRole = 'admin';
  bool _isLoading = false;
  
  final List<AdminUser> _adminUsers = [
    AdminUser(
      id: '1',
      email: 'admin@nourasbutterflies.com',
      role: 'Super Admin',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-20',
      isActive: true,
    ),
    AdminUser(
      id: '2',
      email: 'manager@nourasbutterflies.com',
      role: 'Manager',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-19',
      isActive: true,
    ),
    AdminUser(
      id: '3',
      email: 'staff@nourasbutterflies.com',
      role: 'Staff',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-18',
      isActive: false,
    ),
  ];

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Add Admin User
          SettingsSection(
            title: 'Add Admin User',
            subtitle: 'Invite new administrators to your store',
            children: [
              SettingsTextField(
                label: 'Email Address',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                required: true,
                helperText: 'Enter the email address of the user to invite',
                prefixIcon: Icon(Icons.email, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              SettingsDropdown<String>(
                label: 'Role',
                value: _selectedRole,
                items: const [
                  DropdownMenuItem(
                    value: 'admin',
                    child: Text('Admin'),
                  ),
                  DropdownMenuItem(
                    value: 'manager',
                    child: Text('Manager'),
                  ),
                  DropdownMenuItem(
                    value: 'staff',
                    child: Text('Staff'),
                  ),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
                prefixIcon: Icon(Icons.admin_panel_settings, color: AppColors.adminPrimary),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Spacer(),
                  ElevatedButton.icon(
                    onPressed: _addAdminUser,
                    icon: const Icon(Icons.send, size: 16),
                    label: const Text('Send Invitation'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.adminPrimary,
                      foregroundColor: AppColors.surfaceLight,
                    ),
                  ),
                ],
              ),
            ],
          ),
          // Current Admin Users
          SettingsSection(
            title: 'Current Admin Users',
            subtitle: 'Manage existing administrator accounts',
            children: [
              ..._adminUsers.map((user) => _buildUserCard(user)),
            ],
          ),
          // Save Button
          const SizedBox(height: 24),
          Row(
            children: [
              const Spacer(),
              SaveButton(
                onPressed: _saveUserSettings,
                isLoading: _isLoading,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildUserCard(AdminUser user) {
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
              // User Avatar
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _getRoleColor(user.role).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: _getRoleColor(user.role).withOpacity(0.3),
                  ),
                ),
                child: Icon(
                  Icons.person,
                  color: _getRoleColor(user.role),
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              // User Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          user.email,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark,
                          ),
                        ),
                        const SizedBox(width: 8),
                        // Role Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: _getRoleColor(user.role).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            user.role,
                            style: TextStyle(
                              color: _getRoleColor(user.role),
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        // Active Status Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: user.isActive
                                ? AppColors.success.withOpacity(0.1)
                                : AppColors.gray300.withOpacity(0.3),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            user.isActive ? 'Active' : 'Inactive',
                            style: TextStyle(
                              color: user.isActive ? AppColors.success : AppColors.gray600,
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          Icons.schedule,
                          size: 14,
                          color: AppColors.textSoft,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Created: ${user.createdAt}',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSoft,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Icon(
                          Icons.login,
                          size: 14,
                          color: AppColors.textSoft,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Last login: ${user.lastLogin}',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSoft,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Actions
              Column(
                children: [
                  IconButton(
                    onPressed: () => _editUser(user),
                    icon: Icon(
                      Icons.edit,
                      color: AppColors.adminPrimary,
                      size: 20,
                    ),
                    tooltip: 'Edit User',
                  ),
                  IconButton(
                    onPressed: () => _toggleUser(user),
                    icon: Icon(
                      user.isActive ? Icons.toggle_on : Icons.toggle_off,
                      color: user.isActive ? AppColors.success : AppColors.gray400,
                      size: 20,
                    ),
                    tooltip: user.isActive ? 'Deactivate' : 'Activate',
                  ),
                  IconButton(
                    onPressed: () => _removeUser(user),
                    icon: Icon(
                      Icons.delete,
                      color: AppColors.error,
                      size: 20,
                    ),
                    tooltip: 'Remove User',
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getRoleColor(String role) {
    switch (role.toLowerCase()) {
      case 'super admin':
        return AppColors.adminPrimary;
      case 'admin':
        return AppColors.adminGold;
      case 'manager':
        return AppColors.adminSage;
      case 'staff':
        return AppColors.adminCoral;
      default:
        return AppColors.gray500;
    }
  }

  Future<void> _addAdminUser() async {
    if (_emailController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter an email address'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Invitation sent to ${_emailController.text}'),
            backgroundColor: AppColors.success,
          ),
        );
        _emailController.clear();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error sending invitation: $e'),
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

  void _editUser(AdminUser user) {
    // TODO: Implement edit user
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Edit ${user.email} functionality coming soon!'),
      ),
    );
  }

  void _toggleUser(AdminUser user) {
    setState(() {
      user.isActive = !user.isActive;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${user.email} ${user.isActive ? 'activated' : 'deactivated'}'),
        backgroundColor: AppColors.success,
      ),
    );
  }

  void _removeUser(AdminUser user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove User'),
        content: Text('Are you sure you want to remove ${user.email}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _adminUsers.removeWhere((u) => u.id == user.id);
              });
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${user.email} removed successfully'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Remove', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }

  Future<void> _saveUserSettings() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('User management settings saved successfully!'),
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

class AdminUser {
  final String id;
  final String email;
  final String role;
  final String createdAt;
  final String lastLogin;
  bool isActive;

  AdminUser({
    required this.id,
    required this.email,
    required this.role,
    required this.createdAt,
    required this.lastLogin,
    required this.isActive,
  });
}
