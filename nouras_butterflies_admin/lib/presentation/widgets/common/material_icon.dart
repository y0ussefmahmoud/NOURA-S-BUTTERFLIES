import 'package:flutter/material.dart';

class MaterialIcon extends StatelessWidget {
  final String icon;
  final double? size;
  final Color? color;
  
  const MaterialIcon(
    this.icon, {
    this.size,
    this.color,
    Key? key,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Text(
      icon,
      style: TextStyle(
        fontFamily: 'MaterialSymbols',
        fontSize: size ?? 24,
        color: color,
      ),
    );
  }
}
