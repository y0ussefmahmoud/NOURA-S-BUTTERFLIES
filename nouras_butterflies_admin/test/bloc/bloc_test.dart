import 'package:flutter_test/flutter_test.dart';
import 'package:bloc_test/bloc_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/dashboard/dashboard_bloc.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/dashboard/dashboard_event.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/dashboard/dashboard_state.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/auth/auth_bloc.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/auth/auth_event.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/auth/auth_state.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/products/products_bloc.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/products/products_event.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/products/products_state.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/orders/orders_bloc.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/orders/orders_event.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/orders/orders_state.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/customers/customers_bloc.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/customers/customers_event.dart';
import 'package:nouras_butterflies_admin/presentation/bloc/customers/customers_state.dart';
import 'package:nouras_butterflies_admin/data/models/admin_dashboard_data.dart';
import 'package:nouras_butterflies_admin/data/models/admin_product.dart';
import 'package:nouras_butterflies_admin/data/models/order.dart';
import 'package:nouras_butterflies_admin/data/models/customer.dart';
import 'package:nouras_butterflies_admin/data/models/user.dart';
import 'package:nouras_butterflies_admin/data/repositories/admin_product_repository.dart';
import 'package:nouras_butterflies_admin/data/repositories/auth_repository.dart';
import 'package:nouras_butterflies_admin/data/repositories/order_repository.dart';
import 'package:nouras_butterflies_admin/data/repositories/customer_repository.dart';

class MockAdminProductRepository extends Mock implements AdminProductRepository {}
class MockAuthRepository extends Mock implements AuthRepository {}
class MockOrderRepository extends Mock implements OrderRepository {}
class MockCustomerRepository extends Mock implements CustomerRepository {}

void main() {
  group('DashboardBloc Tests', () {
    late DashboardBloc dashboardBloc;
    late MockAdminProductRepository mockRepository;

    setUp(() {
      mockRepository = MockAdminProductRepository();
      dashboardBloc = DashboardBloc(repository: mockRepository);
    });

    tearDown(() {
      dashboardBloc.close();
    });

    blocTest<DashboardBloc, DashboardState>(
      'emits [DashboardLoading, DashboardLoaded] when LoadDashboardStats is added and succeeds',
      build: () {
        when(() => mockRepository.getDashboardStats())
            .thenAnswer((_) async => AdminDashboardData(
              totalSales: 12345.67,
              totalOrders: 156,
              totalCustomers: 89,
              totalProducts: 45,
              recentOrders: [],
              topProducts: [],
              salesData: [],
            ));
        return dashboardBloc;
      },
      act: (bloc) => bloc.add(LoadDashboardStats()),
      expect: () => [
        DashboardLoading(),
        DashboardLoaded(
          dashboardData: AdminDashboardData(
            totalSales: 12345.67,
            totalOrders: 156,
            totalCustomers: 89,
            totalProducts: 45,
            recentOrders: [],
            topProducts: [],
            salesData: [],
          ),
        ),
      ],
    );

    blocTest<DashboardBloc, DashboardState>(
      'emits [DashboardLoading, DashboardError] when LoadDashboardStats fails',
      build: () {
        when(() => mockRepository.getDashboardStats())
            .thenThrow(Exception('Failed to load dashboard data'));
        return dashboardBloc;
      },
      act: (bloc) => bloc.add(LoadDashboardStats()),
      expect: () => [
        DashboardLoading(),
        DashboardError('Failed to load dashboard data'),
      ],
    );

    blocTest<DashboardBloc, DashboardState>(
      'emits [DashboardLoading, DashboardLoaded] when RefreshDashboardStats is added',
      build: () {
        when(() => mockRepository.getDashboardStats())
            .thenAnswer((_) async => AdminDashboardData(
              totalSales: 54321.89,
              totalOrders: 234,
              totalCustomers: 123,
              totalProducts: 67,
              recentOrders: [],
              topProducts: [],
              salesData: [],
            ));
        return dashboardBloc;
      },
      act: (bloc) => bloc.add(RefreshDashboardStats()),
      expect: () => [
        DashboardLoading(),
        DashboardLoaded(
          dashboardData: AdminDashboardData(
            totalSales: 54321.89,
            totalOrders: 234,
            totalCustomers: 123,
            totalProducts: 67,
            recentOrders: [],
            topProducts: [],
            salesData: [],
          ),
        ),
      ],
    );
  });

  group('AuthBloc Tests', () {
    late AuthBloc authBloc;
    late MockAuthRepository mockAuthRepository;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      authBloc = AuthBloc(repository: mockAuthRepository);
    });

    tearDown(() {
      authBloc.close();
    });

    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, Authenticated] when LoginRequested succeeds',
      build: () {
        when(() => mockAuthRepository.login(email: any(named: 'email'), password: any(named: 'password')))
            .thenAnswer((_) async => User(
              id: '1',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin',
            ));
        return authBloc;
      },
      act: (bloc) => bloc.add(LoginRequested(
        email: 'admin@example.com',
        password: 'password123',
      )),
      expect: () => [
        AuthLoading(),
        Authenticated(user: User(
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        )),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, AuthError] when LoginRequested fails',
      build: () {
        when(() => mockAuthRepository.login(email: any(named: 'email'), password: any(named: 'password')))
            .thenThrow(Exception('Invalid credentials'));
        return authBloc;
      },
      act: (bloc) => bloc.add(LoginRequested(
        email: 'admin@example.com',
        password: 'wrongpassword',
      )),
      expect: () => [
        AuthLoading(),
        AuthError('Invalid credentials'),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [Unauthenticated] when LogoutRequested is added',
      build: () => authBloc,
      act: (bloc) => bloc.add(LogoutRequested()),
      expect: () => [
        Unauthenticated(),
      ],
    );
  });

  group('ProductsBloc Tests', () {
    late ProductsBloc productsBloc;
    late MockAdminProductRepository mockRepository;

    setUp(() {
      mockRepository = MockAdminProductRepository();
      productsBloc = ProductsBloc(repository: mockRepository);
    });

    tearDown(() {
      productsBloc.close();
    });

    blocTest<ProductsBloc, ProductsState>(
      'emits [ProductsLoading, ProductsLoaded] when LoadProducts is added',
      build: () {
        when(() => mockRepository.getProducts())
            .thenAnswer((_) async => [
              AdminProduct(
                id: '1',
                name: 'Test Product',
                price: 99.99,
                description: 'Test Description',
                category: 'Test Category',
                stock: 10,
                isActive: true,
                createdAt: DateTime.now(),
                updatedAt: DateTime.now(),
              ),
            ]);
        return productsBloc;
      },
      act: (bloc) => bloc.add(LoadProducts()),
      expect: () => [
        ProductsLoading(),
        ProductsLoaded(products: [
          AdminProduct(
            id: '1',
            name: 'Test Product',
            price: 99.99,
            description: 'Test Description',
            category: 'Test Category',
            stock: 10,
            isActive: true,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          ),
        ]),
      ],
    );

    blocTest<ProductsBloc, ProductsState>(
      'emits [ProductsLoading, ProductAdded] when AddProduct is added and succeeds',
      build: () {
        when(() => mockRepository.addProduct(product: any(named: 'product')))
            .thenAnswer((_) async => AdminProduct(
              id: '2',
              name: 'New Product',
              price: 149.99,
              description: 'New Description',
              category: 'New Category',
              stock: 20,
              isActive: true,
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
            ));
        return productsBloc;
      },
      act: (bloc) => bloc.add(AddProduct(product: AdminProduct(
        name: 'New Product',
        price: 149.99,
        description: 'New Description',
        category: 'New Category',
        stock: 20,
        isActive: true,
      ))),
      expect: () => [
        ProductsLoading(),
        ProductAdded(product: AdminProduct(
          id: '2',
          name: 'New Product',
          price: 149.99,
          description: 'New Description',
          category: 'New Category',
          stock: 20,
          isActive: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        )),
      ],
    );

    blocTest<ProductsBloc, ProductsState>(
      'emits [ProductsLoading, ProductUpdated] when UpdateProduct is added and succeeds',
      build: () {
        when(() => mockRepository.updateProduct(product: any(named: 'product')))
            .thenAnswer((_) async => AdminProduct(
              id: '1',
              name: 'Updated Product',
              price: 199.99,
              description: 'Updated Description',
              category: 'Updated Category',
              stock: 15,
              isActive: true,
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
            ));
        return productsBloc;
      },
      act: (bloc) => bloc.add(UpdateProduct(product: AdminProduct(
        id: '1',
        name: 'Updated Product',
        price: 199.99,
        description: 'Updated Description',
        category: 'Updated Category',
        stock: 15,
        isActive: true,
      ))),
      expect: () => [
        ProductsLoading(),
        ProductUpdated(product: AdminProduct(
          id: '1',
          name: 'Updated Product',
          price: 199.99,
          description: 'Updated Description',
          category: 'Updated Category',
          stock: 15,
          isActive: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        )),
      ],
    );

    blocTest<ProductsBloc, ProductsState>(
      'emits [ProductsLoading, ProductDeleted] when DeleteProduct is added and succeeds',
      build: () {
        when(() => mockRepository.deleteProduct(productId: any(named: 'productId')))
            .thenAnswer((_) async => true);
        return productsBloc;
      },
      act: (bloc) => bloc.add(DeleteProduct(productId: '1')),
      expect: () => [
        ProductsLoading(),
        ProductDeleted(productId: '1'),
      ],
    );
  });

  group('OrdersBloc Tests', () {
    late OrdersBloc ordersBloc;
    late MockOrderRepository mockRepository;

    setUp(() {
      mockRepository = MockOrderRepository();
      ordersBloc = OrdersBloc(repository: mockRepository);
    });

    tearDown(() {
      ordersBloc.close();
    });

    blocTest<OrdersBloc, OrdersState>(
      'emits [OrdersLoading, OrdersLoaded] when LoadOrders is added',
      build: () {
        when(() => mockRepository.getOrders())
            .thenAnswer((_) async => [
              Order(
                id: 'ORD-001',
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                total: 299.99,
                status: OrderStatus.pending,
                date: DateTime.now(),
                items: [],
              ),
            ]);
        return ordersBloc;
      },
      act: (bloc) => bloc.add(LoadOrders()),
      expect: () => [
        OrdersLoading(),
        OrdersLoaded(orders: [
          Order(
            id: 'ORD-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            total: 299.99,
            status: OrderStatus.pending,
            date: DateTime.now(),
            items: [],
          ),
        ]),
      ],
    );

    blocTest<OrdersBloc, OrdersState>(
      'emits [OrdersLoading, OrderStatusUpdated] when UpdateOrderStatus is added',
      build: () {
        when(() => mockRepository.updateOrderStatus(
          orderId: any(named: 'orderId'),
          status: any(named: 'status'),
        )).thenAnswer((_) async => true);
        return ordersBloc;
      },
      act: (bloc) => bloc.add(UpdateOrderStatus(
        orderId: 'ORD-001',
        status: OrderStatus.shipped,
      )),
      expect: () => [
        OrdersLoading(),
        OrderStatusUpdated(orderId: 'ORD-001', status: OrderStatus.shipped),
      ],
    );
  });

  group('CustomersBloc Tests', () {
    late CustomersBloc customersBloc;
    late MockCustomerRepository mockRepository;

    setUp(() {
      mockRepository = MockCustomerRepository();
      customersBloc = CustomersBloc(repository: mockRepository);
    });

    tearDown(() {
      customersBloc.close();
    });

    blocTest<CustomersBloc, CustomersState>(
      'emits [CustomersLoading, CustomersLoaded] when LoadCustomers is added',
      build: () {
        when(() => mockRepository.getCustomers())
            .thenAnswer((_) async => [
              Customer(
                id: 'CUST-001',
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+966501234567',
                totalOrders: 5,
                totalSpent: 1250.00,
                createdAt: DateTime.now(),
              ),
            ]);
        return customersBloc;
      },
      act: (bloc) => bloc.add(LoadCustomers()),
      expect: () => [
        CustomersLoading(),
        CustomersLoaded(customers: [
          Customer(
            id: 'CUST-001',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+966501234567',
            totalOrders: 5,
            totalSpent: 1250.00,
            createdAt: DateTime.now(),
          ),
        ]),
      ],
    );
  });
}
