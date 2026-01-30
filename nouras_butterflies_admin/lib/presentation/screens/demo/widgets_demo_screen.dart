import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../widgets/common/common_widgets.dart';
import '../../widgets/admin/admin_widgets.dart';
import '../../../data/models/product.dart';

class WidgetsDemoScreen extends StatelessWidget {
  const WidgetsDemoScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('UI Components Demo'),
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildButtonsSection(context),
            const SizedBox(height: 32),
            _buildTextFieldsSection(context),
            const SizedBox(height: 32),
            _buildCardsSection(context),
            const SizedBox(height: 32),
            _buildLoadingAndStatesSection(context),
            const SizedBox(height: 32),
            _buildStatsCardsSection(context),
            const SizedBox(height: 32),
            _buildDataTableSection(context),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Text(
        title,
        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
          fontWeight: FontWeight.bold,
          color: AppColors.primary,
        ),
      ),
    );
  }

  Widget _buildButtonsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle(context, 'Buttons'),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            // Primary buttons
            AppButton(
              text: 'Primary Small',
              variant: ButtonVariant.primary,
              size: ButtonSize.small,
              onPressed: () {},
            ),
            AppButton(
              text: 'Primary Medium',
              variant: ButtonVariant.primary,
              size: ButtonSize.medium,
              onPressed: () {},
            ),
            AppButton(
              text: 'Primary Large',
              variant: ButtonVariant.primary,
              size: ButtonSize.large,
              onPressed: () {},
            ),
            // Outline buttons
            AppButton(
              text: 'Outline Small',
              variant: ButtonVariant.outline,
              size: ButtonSize.small,
              onPressed: () {},
            ),
            AppButton(
              text: 'Outline Medium',
              variant: ButtonVariant.outline,
              size: ButtonSize.medium,
              onPressed: () {},
            ),
            AppButton(
              text: 'Outline Large',
              variant: ButtonVariant.outline,
              size: ButtonSize.large,
              onPressed: () {},
            ),
            // Ghost buttons
            AppButton(
              text: 'Ghost Small',
              variant: ButtonVariant.ghost,
              size: ButtonSize.small,
              onPressed: () {},
            ),
            AppButton(
              text: 'Ghost Medium',
              variant: ButtonVariant.ghost,
              size: ButtonSize.medium,
              onPressed: () {},
            ),
            AppButton(
              text: 'Ghost Large',
              variant: ButtonVariant.ghost,
              size: ButtonSize.large,
              onPressed: () {},
            ),
            // Buttons with icons
            AppButton(
              text: 'With Icon',
              variant: ButtonVariant.primary,
              icon: 'add',
              onPressed: () {},
            ),
            AppButton(
              text: 'Loading',
              variant: ButtonVariant.primary,
              loading: true,
              onPressed: () {},
            ),
            AppButton(
              text: 'Disabled',
              variant: ButtonVariant.primary,
              disabled: true,
              onPressed: () {},
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTextFieldsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle(context, 'Text Fields'),
        const Column(
          children: [
            AppTextField(
              label: 'Basic Input',
              hint: 'Enter some text...',
            ),
            SizedBox(height: 16),
            AppTextField(
              label: 'With Icon',
              hint: 'Search...',
              prefixIcon: 'search',
            ),
            SizedBox(height: 16),
            AppTextField(
              label: 'Password',
              hint: 'Enter password...',
              obscureText: true,
              suffixIcon: 'visibility',
            ),
            SizedBox(height: 16),
            AppTextField(
              label: 'Error State',
              hint: 'This field has an error',
              initialValue: 'Invalid input',
            ),
            SizedBox(height: 16),
            AppTextField(
              label: 'Multi-line',
              hint: 'Enter multiple lines...',
              maxLines: 3,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCardsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle(context, 'Cards'),
        Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            AppCard(
              shadow: CardShadow.soft,
              child: SizedBox(
                width: 200,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Soft Shadow Card',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'This card has a soft shadow effect.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
            AppCard(
              shadow: CardShadow.butterflyGlow,
              child: SizedBox(
                width: 200,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Butterfly Glow Card',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'This card has a butterfly glow effect.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
            AppCard(
              onTap: () {},
              child: SizedBox(
                width: 200,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Clickable Card',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Hover over me!',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLoadingAndStatesSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle(context, 'Loading & States'),
        Row(
          children: [
            const Column(
              children: [
                LoadingIndicator(size: LoadingSize.small),
                SizedBox(height: 8),
                Text('Small'),
              ],
            ),
            const SizedBox(width: 32),
            const Column(
              children: [
                LoadingIndicator(size: LoadingSize.medium),
                SizedBox(height: 8),
                Text('Medium'),
              ],
            ),
            const SizedBox(width: 32),
            const Column(
              children: [
                LoadingIndicator(size: LoadingSize.large),
                SizedBox(height: 8),
                Text('Large'),
              ],
            ),
            const SizedBox(width: 32),
            const Column(
              children: [
                LoadingIndicator(
                  size: LoadingSize.medium,
                  message: 'Loading data...',
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 32),
        const Row(
          children: [
            Expanded(
              child: EmptyState(
                icon: 'inbox',
                title: 'No Data',
                subtitle: 'There are no items to display',
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: AppErrorWidget(
                title: 'Something went wrong',
                subtitle: 'Please try again later',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatsCardsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle(context, 'Stats Cards'),
        Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            StatsCard(
              title: 'Total Revenue',
              value: 125000,
              format: StatsFormat.currency,
              change: 12.5,
              changeType: ChangeType.increase,
              icon: 'payments',
              subtitle: 'Last 30 days',
            ),
            StatsCard(
              title: 'Total Orders',
              value: 1847,
              format: StatsFormat.number,
              change: -3.2,
              changeType: ChangeType.decrease,
              icon: 'shopping_cart',
              subtitle: 'Last 30 days',
            ),
            StatsCard(
              title: 'Conversion Rate',
              value: 3.8,
              format: StatsFormat.percentage,
              change: 0.5,
              changeType: ChangeType.increase,
              icon: 'trending_up',
              subtitle: 'Last 30 days',
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDataTableSection(BuildContext context) {
    // Mock data for demonstration
    final mockProducts = [
      {
        'id': '1',
        'name': 'Butterfly Necklace',
        'price': 299.99,
        'stock': 15,
        'status': 'Active',
      },
      {
        'id': '2',
        'name': 'Floral Bracelet',
        'price': 199.99,
        'stock': 8,
        'status': 'Active',
      },
      {
        'id': '3',
        'name': 'Nature Earrings',
        'price': 149.99,
        'stock': 0,
        'status': 'Out of Stock',
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle(context, 'Data Table'),
        DataTableWidget<Map<String, dynamic>>(
          columns: [
            DataTableColumn<Map<String, dynamic>>(
              label: 'ID',
              key: 'id',
              sortable: true,
              width: 80,
            ),
            DataTableColumn<Map<String, dynamic>>(
              label: 'Product Name',
              key: 'name',
              sortable: true,
              render: (value, row) => Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.image,
                      color: AppColors.primary,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Text(value.toString())),
                ],
              ),
            ),
            DataTableColumn<Map<String, dynamic>>(
              label: 'Price',
              key: 'price',
              sortable: true,
              render: (value, row) => Text(
                '\$${value.toString()}',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
            DataTableColumn<Map<String, dynamic>>(
              label: 'Stock',
              key: 'stock',
              sortable: true,
            ),
            DataTableColumn<Map<String, dynamic>>(
              label: 'Status',
              key: 'status',
              render: (value, row) {
                final isActive = value.toString() == 'Active';
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isActive ? Colors.green.shade100 : Colors.red.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    value.toString(),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isActive ? Colors.green.shade700 : Colors.red.shade700,
                    ),
                  ),
                );
              },
            ),
          ],
          data: mockProducts,
          actions: [
            DataTableAction<Map<String, dynamic>>(
              icon: 'edit',
              label: 'Edit',
              onTap: (product) {
                // Handle edit action
              },
            ),
            DataTableAction<Map<String, dynamic>>(
              icon: 'delete',
              label: 'Delete',
              variant: ActionVariant.danger,
              onTap: (product) {
                // Handle delete action
              },
            ),
          ],
          onSort: (key) {
            // Handle sorting
          },
        ),
      ],
    );
  }
}
