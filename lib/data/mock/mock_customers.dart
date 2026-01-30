import '../models/customer.dart';
import '../models/user.dart';

class MockCustomers {
  static final List<Customer> customers = [
    Customer(
      id: 'c1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      membershipTier: MembershipTier.gold,
      points: 1250,
      createdAt: DateTime(2023, 6, 15),
      updatedAt: DateTime(2024, 1, 15),
      totalOrders: 12,
      totalSpent: 487.50,
      lastOrderDate: DateTime(2024, 1, 15),
      tags: ['VIP', 'Regular'],
      preferences: CustomerPreferences(
        newsletter: true,
        sms: false,
        promotions: true,
      ),
    ),
    Customer(
      id: 'c2',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      membershipTier: MembershipTier.silver,
      points: 750,
      createdAt: DateTime(2023, 8, 22),
      updatedAt: DateTime(2024, 1, 18),
      totalOrders: 8,
      totalSpent: 298.00,
      lastOrderDate: DateTime(2024, 1, 18),
      tags: ['Regular'],
      preferences: CustomerPreferences(
        newsletter: true,
        sms: true,
        promotions: true,
      ),
    ),
    Customer(
      id: 'c3',
      name: 'Jessica Chen',
      email: 'jessica.c@email.com',
      membershipTier: MembershipTier.bronze,
      points: 320,
      createdAt: DateTime(2023, 11, 5),
      updatedAt: DateTime(2024, 1, 21),
      totalOrders: 3,
      totalSpent: 125.50,
      lastOrderDate: DateTime(2024, 1, 21),
      tags: ['New'],
      preferences: CustomerPreferences(
        newsletter: false,
        sms: false,
        promotions: false,
      ),
    ),
    Customer(
      id: 'c4',
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      membershipTier: MembershipTier.platinum,
      points: 2100,
      createdAt: DateTime(2023, 3, 10),
      updatedAt: DateTime(2024, 1, 22),
      totalOrders: 25,
      totalSpent: 1250.75,
      lastOrderDate: DateTime(2024, 1, 22),
      tags: ['VIP', 'Loyal', 'High-Value'],
      preferences: CustomerPreferences(
        newsletter: true,
        sms: true,
        promotions: true,
      ),
    ),
    Customer(
      id: 'c5',
      name: 'Amanda White',
      email: 'amanda.w@email.com',
      membershipTier: MembershipTier.silver,
      points: 580,
      createdAt: DateTime(2023, 9, 18),
      updatedAt: DateTime(2024, 1, 10),
      totalOrders: 6,
      totalSpent: 234.25,
      lastOrderDate: DateTime(2024, 1, 10),
      tags: ['Regular'],
      preferences: CustomerPreferences(
        newsletter: true,
        sms: false,
        promotions: true,
      ),
    ),
    Customer(
      id: 'c6',
      name: 'Lisa Thompson',
      email: 'lisa.t@email.com',
      membershipTier: MembershipTier.gold,
      points: 980,
      createdAt: DateTime(2023, 7, 12),
      updatedAt: DateTime(2024, 1, 8),
      totalOrders: 10,
      totalSpent: 412.30,
      lastOrderDate: DateTime(2024, 1, 8),
      tags: ['VIP', 'Regular'],
      preferences: CustomerPreferences(
        newsletter: true,
        sms: true,
        promotions: false,
      ),
    ),
    Customer(
      id: 'c7',
      name: 'Rachel Kim',
      email: 'rachel.k@email.com',
      membershipTier: MembershipTier.bronze,
      points: 150,
      createdAt: DateTime(2023, 12, 20),
      updatedAt: DateTime(2024, 1, 5),
      totalOrders: 2,
      totalSpent: 68.00,
      lastOrderDate: DateTime(2024, 1, 5),
      tags: ['New'],
      preferences: CustomerPreferences(
        newsletter: false,
        sms: false,
        promotions: true,
      ),
    ),
    Customer(
      id: 'c8',
      name: 'Nicole Davis',
      email: 'nicole.d@email.com',
      membershipTier: MembershipTier.platinum,
      points: 3200,
      createdAt: DateTime(2023, 2, 28),
      updatedAt: DateTime(2024, 1, 20),
      totalOrders: 35,
      totalSpent: 1875.90,
      lastOrderDate: DateTime(2024, 1, 20),
      tags: ['VIP', 'Loyal', 'High-Value', 'Influencer'],
      preferences: CustomerPreferences(
        newsletter: true,
        sms: true,
        promotions: true,
      ),
    ),
  ];

  static Customer? getCustomerById(String id) {
    try {
      return customers.firstWhere((customer) => customer.id == id);
    } catch (e) {
      return null;
    }
  }

  static List<Customer> getCustomersByTier(MembershipTier tier) {
    return customers.where((customer) => customer.membershipTier == tier).toList();
  }

  static List<Customer> getVipCustomers() {
    return customers.where((customer) => 
      customer.tags.contains('VIP') || 
      customer.membershipTier == MembershipTier.platinum
    ).toList();
  }

  static List<Customer> getNewCustomers({int days = 30}) {
    final cutoffDate = DateTime.now().subtract(Duration(days: days));
    return customers.where((customer) => customer.createdAt.isAfter(cutoffDate)).toList();
  }

  static List<Customer> getActiveCustomers({int days = 90}) {
    final cutoffDate = DateTime.now().subtract(Duration(days: days));
    return customers.where((customer) => 
      customer.lastOrderDate != null && 
      customer.lastOrderDate!.isAfter(cutoffDate)
    ).toList();
  }

  static Map<MembershipTier, int> getCustomerCountsByTier() {
    final Map<MembershipTier, int> counts = {};
    for (final customer in customers) {
      counts[customer.membershipTier] = (counts[customer.membershipTier] ?? 0) + 1;
    }
    return counts;
  }

  static double getTotalCustomerSpending() {
    return customers.fold(0.0, (sum, customer) => sum + customer.totalSpent);
  }

  static int getTotalCustomerPoints() {
    return customers.fold(0, (sum, customer) => sum + customer.points);
  }
}
