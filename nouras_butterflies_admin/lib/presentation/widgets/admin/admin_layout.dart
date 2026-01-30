import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import 'admin_sidebar.dart';
import 'admin_app_bar.dart';

class BreadcrumbItem {
  final String label;
  final String? route;

  BreadcrumbItem({
    required this.label,
    this.route,
  });
}

class AdminLayout extends StatefulWidget {
  final Widget child;
  final List<BreadcrumbItem>? breadcrumbs;
  final String? pageTitle;

  const AdminLayout({
    Key? key,
    required this.child,
    this.breadcrumbs,
    this.pageTitle,
  }) : super(key: key);

  @override
  State<AdminLayout> createState() => _AdminLayoutState();
}

class _AdminLayoutState extends State<AdminLayout> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late String _currentRoute;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _currentRoute = ModalRoute.of(context)?.settings.name ?? '/admin/dashboard';
    setState(() {});
  }

  @override
  void didUpdateWidget(AdminLayout oldWidget) {
    super.didUpdateWidget(oldWidget);
    final newRoute = ModalRoute.of(context)?.settings.name ?? '/admin/dashboard';
    if (_currentRoute != newRoute) {
      _currentRoute = newRoute;
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 1024;

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppColors.backgroundLight,
      drawer: isMobile
          ? AdminSidebar(
              currentRoute: _currentRoute,
              onClose: () {
                Navigator.of(context).pop();
              },
            )
          : null,
      body: Row(
        children: [
          // Desktop Sidebar
          if (!isMobile)
            AdminSidebar(
              currentRoute: _currentRoute,
            ),
          // Main Content Area
          Expanded(
            child: Column(
              children: [
                // App Bar
                AdminAppBar(
                  onMenuTap: isMobile
                      ? () {
                          _scaffoldKey.currentState?.openDrawer();
                        }
                      : null,
                ),
                // Page Content
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Breadcrumbs
                        if (widget.breadcrumbs != null) _buildBreadcrumbs(),
                        // Page Title
                        if (widget.pageTitle != null) _buildPageTitle(),
                        // Child Content
                        widget.child,
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      // Floating Action Button for Mobile Menu
      floatingActionButton: isMobile
          ? FloatingActionButton(
              onPressed: () {
                _scaffoldKey.currentState?.openDrawer();
              },
              backgroundColor: AppColors.adminPrimary,
              child: const Icon(Icons.menu, color: Colors.white),
            )
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  Widget _buildBreadcrumbs() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: _buildBreadcrumbItems(),
      ),
    );
  }

  List<Widget> _buildBreadcrumbItems() {
    final List<Widget> items = [];
    
    for (int i = 0; i < widget.breadcrumbs!.length; i++) {
      final breadcrumb = widget.breadcrumbs![i];
      final isLast = i == widget.breadcrumbs!.length - 1;
      
      if (i > 0) {
        items.add(
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: Text(
              '/',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 16,
              ),
            ),
          ),
        );
      }
      
      if (isLast) {
        items.add(
          Text(
            breadcrumb.label,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
              color: AppColors.adminPrimary,
            ),
          ),
        );
      } else {
        items.add(
          TextButton(
            onPressed: () {
              if (breadcrumb.route != null) {
                Navigator.pushReplacementNamed(context, breadcrumb.route!);
              }
            },
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: Text(
              breadcrumb.label,
              style: const TextStyle(
                fontWeight: FontWeight.w400,
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
          ),
        );
      }
    }
    
    return items;
  }

  Widget _buildPageTitle() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 32),
      child: Text(
        widget.pageTitle!,
        style: const TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w700,
          color: AppColors.adminPrimary,
        ),
      ),
    );
  }
}
