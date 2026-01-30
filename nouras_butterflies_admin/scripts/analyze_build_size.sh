#!/bin/bash

# Build Size Analysis Script for Noura's Butterflies Admin
# This script analyzes the APK size and provides optimization recommendations

echo "🔍 Starting Build Size Analysis..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean
flutter pub get

# Build APK with size analysis
echo "📦 Building APK with size analysis..."
flutter build apk --release --analyze-size > build_analysis.txt

# Extract key metrics from the analysis
echo "📊 Extracting build metrics..."
if [ -f "build_analysis.txt" ]; then
    echo "=== BUILD ANALYSIS RESULTS ===" >> size_report.txt
    cat build_analysis.txt >> size_report.txt
    echo "" >> size_report.txt
fi

# Get APK size
APK_SIZE=$(du -h build/app/outputs/flutter-apk/app-release.apk | cut -f1)
echo "📱 APK Size: $APK_SIZE" >> size_report.txt

# Analyze dependencies
echo "📚 Analyzing dependencies..."
flutter pub deps --style=tree > deps_tree.txt

# Generate optimization recommendations
echo "💡 OPTIMIZATION RECOMMENDATIONS:" >> size_report.txt
echo "1. Review large dependencies in deps_tree.txt" >> size_report.txt
echo "2. Consider removing unused assets" >> size_report.txt
echo "3. Enable tree shaking for unused code" >> size_report.txt
echo "4. Compress images and assets" >> size_report.txt
echo "5. Use deferred loading for large libraries" >> size_report.txt

# Check for unused assets
echo "🖼️ Checking for unused assets..."
find assets/ -type f -exec basename {} \; | sort > used_assets.txt
grep -r "assets/" lib/ | grep -o "assets/[^'\"]*" | sort | uniq > referenced_assets.txt

echo "✅ Build analysis complete!"
echo "📄 Reports generated:"
echo "  - size_report.txt: Overall size analysis"
echo "  - build_analysis.txt: Detailed Flutter build analysis"
echo "  - deps_tree.txt: Dependency tree"
echo "  - used_assets.txt vs referenced_assets.txt: Asset usage comparison"

# Display summary
echo ""
echo "=== SUMMARY ==="
echo "APK Size: $APK_SIZE"
echo "Check size_report.txt for detailed recommendations"
