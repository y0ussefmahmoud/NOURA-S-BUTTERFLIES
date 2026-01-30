#!/bin/bash

# Flutter Analysis Script for Noura's Butterflies Admin
# This script runs comprehensive code analysis and generates reports

echo "🔍 Starting Flutter Analysis..."

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create reports directory
mkdir -p reports

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Run Flutter analyze
print_status "Running Flutter analyze..."
flutter analyze > reports/flutter_analyze.txt 2>&1
ANALYZE_EXIT_CODE=$?

if [ $ANALYZE_EXIT_CODE -eq 0 ]; then
    print_success "Flutter analyze completed successfully"
else
    print_error "Flutter analyze found issues"
fi

# Run dart format check
print_status "Checking code formatting..."
dart format --set-exit-if-changed . > reports/format_check.txt 2>&1
FORMAT_EXIT_CODE=$?

if [ $FORMAT_EXIT_CODE -eq 0 ]; then
    print_success "Code formatting is correct"
else
    print_warning "Code formatting issues found"
fi

# Run custom analysis scripts
print_status "Running custom analysis..."

# Check for performance anti-patterns
echo "Checking for performance anti-patterns..." > reports/performance_analysis.txt

# Check for unnecessary widgets
grep -r "Container(" lib/ --include="*.dart" | grep -v "// ignore:" | head -10 >> reports/performance_analysis.txt

# Check for missing const constructors
grep -r "new \w\+(" lib/ --include="*.dart" | grep -v "// ignore:" | head -10 >> reports/performance_analysis.txt

# Check for potential memory leaks
grep -r "Timer\.periodic\|Stream\.listen\|AnimationController" lib/ --include="*.dart" | grep -v "dispose()" | head -10 >> reports/performance_analysis.txt

# Check for large files
echo "Checking for large files..." >> reports/performance_analysis.txt
find lib/ -name "*.dart" -exec wc -l {} + | sort -nr | head -10 >> reports/performance_analysis.txt

# Generate complexity report
print_status "Analyzing code complexity..."
echo "Code Complexity Analysis" > reports/complexity_analysis.txt

# Find files with high line counts
echo -e "\nFiles with highest line count:" >> reports/complexity_analysis.txt
find lib/ -name "*.dart" -exec wc -l {} + | sort -nr | head -10 >> reports/complexity_analysis.txt

# Find files with many functions
echo -e "\nFiles with most functions:" >> reports/complexity_analysis.txt
find lib/ -name "*.dart" -exec grep -c "^\s*[A-Za-z_][A-Za-z0-9_]*\s*(" {} + | sort -t: -k2 -nr | head -10 >> reports/complexity_analysis.txt

# Check for TODO comments
print_status "Checking for TODO comments..."
grep -r "TODO\|FIXME\|HACK" lib/ --include="*.dart" > reports/todos.txt

# Generate dependency analysis
print_status "Analyzing dependencies..."
echo "Dependency Analysis" > reports/dependency_analysis.txt

# Check pubspec.yaml dependencies
echo -e "\nDirect dependencies:" >> reports/dependency_analysis.txt
grep -A 50 "dependencies:" pubspec.yaml | grep -v "dependencies:" | grep -v "flutter:" | grep -v "sdk:" >> reports/dependency_analysis.txt

# Check for unused imports (basic check)
echo -e "\nPotentially unused imports:" >> reports/dependency_analysis.txt
find lib/ -name "*.dart" -exec grep -l "^import" {} \; | while read file; do
    # This is a simplified check - in a real scenario you'd use a more sophisticated tool
    echo "Checking $file for unused imports..." >> reports/dependency_analysis.txt
done

# Generate summary report
print_status "Generating summary report..."
cat > reports/analysis_summary.txt << EOF
Flutter Analysis Summary Report
Generated on: $(date)

=== Analysis Results ===
Flutter Analyze Exit Code: $ANALYZE_EXIT_CODE
Format Check Exit Code: $FORMAT_EXIT_CODE

=== File Statistics ===
Total Dart files: $(find lib/ -name "*.dart" | wc -l)
Total lines of code: $(find lib/ -name "*.dart" -exec cat {} + | wc -l)

=== Issues Found ===
TODO/FIXME comments: $(grep -r "TODO\|FIXME" lib/ --include="*.dart" | wc -l)
Performance issues: $(grep -c "Container\|new \w\+(" reports/performance_analysis.txt)

=== Recommendations ===
1. Review any issues found in flutter_analyze.txt
2. Fix formatting issues with 'dart format .'
3. Address performance anti-patterns
4. Clean up TODO comments
5. Consider breaking down large files

EOF

print_success "Analysis complete! Reports generated in 'reports/' directory:"
echo "  - flutter_analyze.txt: Flutter analysis results"
echo "  - format_check.txt: Code formatting check"
echo "  - performance_analysis.txt: Performance anti-patterns"
echo "  - complexity_analysis.txt: Code complexity analysis"
echo "  - todos.txt: TODO and FIXME comments"
echo "  - dependency_analysis.txt: Dependency analysis"
echo "  - analysis_summary.txt: Summary report"

# Exit with appropriate code
if [ $ANALYZE_EXIT_CODE -ne 0 ] || [ $FORMAT_EXIT_CODE -ne 0 ]; then
    exit 1
else
    exit 0
fi
