export const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

export const select = (selector, parent = document) =>
  parent.querySelector(selector);

export const selectAll = (selector, parent = document) => [
  ...parent.querySelectorAll(selector)
];

export const toggleClasses = (element, classes, enabled) => {
  if (element) element.classList.toggle(classes, enabled);
};

const ACTIVE_BUTTON_CLASSES = [
  'active',
  'border-primary',
  'bg-mint/40',
  'text-primary',
  'font-semibold'
];

const INACTIVE_BUTTON_CLASSES = [
  'border-outline-variant',
  'text-on-surface-variant'
];

export function setActiveButton(button, groupSelector) {
  selectAll(groupSelector).forEach(groupButton => {
    groupButton.classList.remove(...ACTIVE_BUTTON_CLASSES);
    groupButton.classList.add(...INACTIVE_BUTTON_CLASSES);
  });

  button.classList.add(...ACTIVE_BUTTON_CLASSES);
  button.classList.remove(...INACTIVE_BUTTON_CLASSES);
}
