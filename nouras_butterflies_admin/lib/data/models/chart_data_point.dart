class ChartDataPoint {
  final String label;
  final double value;

  const ChartDataPoint({
    required this.label,
    required this.value,
  });

  factory ChartDataPoint.fromJson(Map<String, dynamic> json) {
    return ChartDataPoint(
      label: json['label'] as String,
      value: (json['value'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'value': value,
    };
  }

  ChartDataPoint copyWith({
    String? label,
    double? value,
  }) {
    return ChartDataPoint(
      label: label ?? this.label,
      value: value ?? this.value,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ChartDataPoint &&
        other.label == label &&
        other.value == value;
  }

  @override
  int get hashCode => label.hashCode ^ value.hashCode;

  @override
  String toString() => 'ChartDataPoint(label: $label, value: $value)';
}
