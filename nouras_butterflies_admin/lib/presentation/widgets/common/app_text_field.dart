import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';

class AppTextField extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? initialValue;
  final bool obscureText;
  final int maxLines;
  final int? maxLength;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final void Function(String?)? onSaved;
  final void Function()? onTap;
  final bool enabled;
  final bool readOnly;
  final String? prefixIcon;
  final String? suffixIcon;
  final VoidCallback? onSuffixIconTap;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final TextInputAction? textInputAction;
  final void Function(String)? onSubmitted;

  const AppTextField({
    Key? key,
    this.label,
    this.hint,
    this.initialValue,
    this.obscureText = false,
    this.maxLines = 1,
    this.maxLength,
    this.keyboardType,
    this.inputFormatters,
    this.validator,
    this.onChanged,
    this.onSaved,
    this.onTap,
    this.enabled = true,
    this.readOnly = false,
    this.prefixIcon,
    this.suffixIcon,
    this.onSuffixIconTap,
    this.controller,
    this.focusNode,
    this.textInputAction,
    this.onSubmitted,
  }) : super(key: key);

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  late FocusNode _focusNode;
  bool _isFocused = false;
  bool _obscureText = false;

  @override
  void initState() {
    super.initState();
    _focusNode = widget.focusNode ?? FocusNode();
    _obscureText = widget.obscureText;
    _focusNode.addListener(_onFocusChange);
  }

  @override
  void dispose() {
    if (widget.focusNode == null) {
      _focusNode.dispose();
    }
    super.dispose();
  }

  void _onFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
  }

  void _toggleObscureText() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            margin: EdgeInsets.only(
              bottom: _isFocused || (widget.controller?.text.isNotEmpty ?? false) ? 4 : 8,
            ),
            child: Text(
              widget.label!,
              style: TextStyle(
                fontSize: _isFocused || (widget.controller?.text.isNotEmpty ?? false) ? 12 : 14,
                color: _isFocused ? AppColors.primary : theme.colorScheme.onSurface.withOpacity(0.7),
                fontWeight: _isFocused ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ),
        ],
        TextFormField(
          controller: widget.controller,
          focusNode: _focusNode,
          initialValue: widget.controller == null ? widget.initialValue : null,
          obscureText: _obscureText,
          maxLines: widget.maxLines,
          maxLength: widget.maxLength,
          keyboardType: widget.keyboardType,
          inputFormatters: widget.inputFormatters,
          validator: widget.validator,
          onChanged: widget.onChanged,
          onSaved: widget.onSaved,
          onTap: widget.onTap,
          enabled: widget.enabled,
          readOnly: widget.readOnly,
          textInputAction: widget.textInputAction,
          onFieldSubmitted: widget.onSubmitted,
          style: TextStyle(
            fontSize: 14,
            color: theme.colorScheme.onSurface,
          ),
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: TextStyle(
              color: theme.colorScheme.onSurface.withOpacity(0.4),
            ),
            prefixIcon: widget.prefixIcon != null
              ? Padding(
                  padding: const EdgeInsets.all(12),
                  child: MaterialIcon(
                    widget.prefixIcon!,
                    size: 20,
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                )
              : null,
            suffixIcon: widget.suffixIcon != null || widget.obscureText
              ? Padding(
                  padding: const EdgeInsets.all(12),
                  child: InkWell(
                    onTap: widget.obscureText ? _toggleObscureText : widget.onSuffixIconTap,
                    borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
                    child: MaterialIcon(
                      widget.obscureText ? (_obscureText ? 'visibility' : 'visibility_off') : widget.suffixIcon!,
                      size: 20,
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                )
              : null,
            filled: true,
            fillColor: widget.enabled
              ? (isDark ? AppColors.surfaceDark : AppColors.surfaceLight)
              : theme.colorScheme.surface.withOpacity(0.5),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              borderSide: BorderSide(
                color: isDark ? AppColors.borderDark : AppColors.borderLight,
                width: 1,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              borderSide: BorderSide(
                color: isDark ? AppColors.borderDark : AppColors.borderLight,
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              borderSide: BorderSide(
                color: AppColors.primary,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              borderSide: BorderSide(
                color: AppColors.error,
                width: 1,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              borderSide: BorderSide(
                color: AppColors.error,
                width: 2,
              ),
            ),
            errorStyle: TextStyle(
              color: AppColors.error,
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }
}

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
