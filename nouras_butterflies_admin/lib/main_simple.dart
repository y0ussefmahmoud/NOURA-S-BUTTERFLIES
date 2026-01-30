import 'package:flutter/material.dart';

void main() {
  runApp(const NourasButterfliesAdminApp());
}

class NourasButterfliesAdminApp extends StatelessWidget {
  const NourasButterfliesAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Noura\'s Butterflies Admin',
      theme: ThemeData(
        primarySwatch: Colors.pink,
        useMaterial3: true,
      ),
      home: const AdminHomePage(),
    );
  }
}

class AdminHomePage extends StatelessWidget {
  const AdminHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Noura\'s Butterflies Admin'),
        backgroundColor: Colors.pink[100],
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.admin_panel_settings,
              size: 100,
              color: Colors.pink,
            ),
            SizedBox(height: 20),
            Text(
              'Welcome to Admin Panel',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            Text(
              'Flutter Admin Application',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 30),
            Card(
              margin: EdgeInsets.all(20),
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text(
                      'Application Status',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            Icon(Icons.check_circle, color: Colors.green),
                            Text('Connected'),
                          ],
                        ),
                        Column(
                          children: [
                            Icon(Icons.dashboard, color: Colors.blue),
                            Text('Dashboard'),
                          ],
                        ),
                        Column(
                          children: [
                            Icon(Icons.settings, color: Colors.orange),
                            Text('Settings'),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
