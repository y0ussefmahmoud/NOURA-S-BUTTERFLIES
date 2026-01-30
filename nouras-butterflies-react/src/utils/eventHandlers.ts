import type { MouseEvent, KeyboardEvent } from 'react';

type ClickHandler<T extends HTMLElement = HTMLElement> = (event: MouseEvent<T>) => void;

type KeyboardHandler<T extends HTMLElement = HTMLElement> = (event: KeyboardEvent<T>) => void;

const safeStopPropagation = (event: { stopPropagation?: () => void }) => {
  event.stopPropagation?.();
};

export const stopPropagation = <T extends HTMLElement = HTMLElement>(
  handler?: ClickHandler<T>
): ClickHandler<T> => {
  return (event) => {
    safeStopPropagation(event);
    handler?.(event);
  };
};

export const createClickHandler = <T extends HTMLElement = HTMLElement>(
  handler: ClickHandler<T>,
  options: { stopPropagation?: boolean } = { stopPropagation: true }
): ClickHandler<T> => {
  return (event) => {
    if (options.stopPropagation) {
      safeStopPropagation(event);
    }
    handler(event);
  };
};

export const createKeyboardHandler = <T extends HTMLElement = HTMLElement>(
  handler: KeyboardHandler<T>,
  options: { stopPropagation?: boolean; keys?: string[] } = { stopPropagation: true }
): KeyboardHandler<T> => {
  return (event) => {
    if (options.keys && !options.keys.includes(event.key)) {
      return;
    }
    if (options.stopPropagation) {
      safeStopPropagation(event);
    }
    handler(event);
  };
};
