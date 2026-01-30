import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  focusable?: boolean;
  as?: React.ElementType;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  focusable = false,
  as: Component = 'span',
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  };

  if (focusable) {
    return (
      <Component style={style} className="visually-hidden-focusable">
        {children}
      </Component>
    );
  }

  return <Component style={style}>{children}</Component>;
};
