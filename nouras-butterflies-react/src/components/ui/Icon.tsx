import React from 'react';
import type { IconProps } from '../../types/components';
import { cn } from '../../utils/cn';

// Icons that should flip in RTL mode
const RTL_FLIPPABLE_ICONS = [
  'arrow_back',
  'arrow_forward',
  'chevron_left',
  'chevron_right',
  'arrow_back_ios',
  'arrow_forward_ios',
  'first_page',
  'last_page',
  'keyboard_backspace',
  'keyboard_arrow_left',
  'keyboard_arrow_right',
  'keyboard_tab',
  'subdirectory_arrow_left',
  'subdirectory_arrow_right',
  'format_align_left',
  'format_align_right',
  'format_indent_decrease',
  'format_indent_increase',
  'format_list_bulleted',
  'format_list_numbered',
  'format_quote',
  'reply',
  'forward',
  'send',
  'redo',
  'undo',
  'arrow_left_alt',
  'arrow_right_alt',
  'arrow_outward',
  'arrow_inward',
  'call_made',
  'call_received',
  'call_missed',
  'call_missed_outgoing',
  'call_missed_outgoing',
  'switch_left',
  'switch_right',
  'trending_flat',
  'trending_up',
  'trending_down',
  'previous',
  'next',
  'navigate_before',
  'navigate_next',
  'open_in_new',
  'login',
  'logout',
  'exit_to_app',
  'arrow_circle_left',
  'arrow_circle_right',
  'arrow_left',
  'arrow_right',
  'arrow_up_left',
  'arrow_up_right',
  'arrow_down_left',
  'arrow_down_right',
];

/**
 * Icon component wrapper for Material Symbols
 *
 * @param name - Material Symbol icon name
 * @param size - Size of the icon
 * @param fill - Whether to use filled variant
 * @param weight - Weight of the icon (100-700)
 * @param grade - Grade of the icon (-25 to 200)
 * @param color - Color of the icon
 * @param shouldFlipRTL - Whether to flip icon in RTL mode
 * @param onClick - Click handler
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      className,
      name,
      size = 'md',
      fill = false,
      weight = 400,
      grade = 0,
      color,
      shouldFlipRTL = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    };

    const actualSize = typeof size === 'number' ? size : sizeMap[size];
    const sizeStyle = { fontSize: `${actualSize}px` };

    const weightClass = weight !== 400 ? `font-weight-${weight}` : '';
    const gradeClass = grade !== 0 ? `font-grade-${grade}` : '';
    const fillClass = fill ? 'fill-1' : '';
    const colorClass = color || '';

    // Determine if icon should flip in RTL mode
    const shouldFlip = shouldFlipRTL || RTL_FLIPPABLE_ICONS.includes(name);
    const flipClass = shouldFlip ? 'rtl-flip' : '';

    const classes = cn(
      'material-symbols-outlined',
      'inline-flex items-center justify-center',
      'transition-all duration-200',
      fillClass,
      weightClass,
      gradeClass,
      colorClass,
      flipClass,
      onClick &&
        'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
      className
    );

    return (
      <span
        ref={ref}
        className={classes}
        style={sizeStyle}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        {...props}
      >
        {name}
      </span>
    );
  }
);

Icon.displayName = 'Icon';
