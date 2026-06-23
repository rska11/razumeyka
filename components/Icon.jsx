'use client';

const icons = {
  arrow: 'M5 12h14M13 5l7 7-7 7',
  abacus: 'M5 5h14M5 19h14M7 5v14M17 5v14M9 9h2M13 9h2M9 15h2M13 15h2',
  book: 'M5 5.5A3.5 3.5 0 0 1 8.5 2H19v17H8.5A3.5 3.5 0 0 0 5 22V5.5ZM5 5.5V22M8 6h7M8 10h8',
  palette:
    'M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.7-3.05 1.2 1.2 0 0 1 1-1.95H18a6 6 0 0 0 0-12h-6ZM7.5 11.5h.01M10 7.5h.01M14 7.5h.01',
  spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM18 16l.9 2.1L21 19l-2.1.9L18 22l-.9-2.1L15 19l2.1-.9L18 16Z',
  theater:
    'M7 4h10l2 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l2-3ZM8.5 10h.01M15.5 10h.01M9 15c1.4 1.2 4.6 1.2 6 0',
  memory:
    'M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.3A3.5 3.5 0 0 0 7.5 18H9V3ZM15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5.3A3.5 3.5 0 0 1 16.5 18H15V3ZM9 8H7M15 8h2M9 13H7M15 13h2',
  logic: 'M6 7h12M6 12h12M6 17h12M4 7h.01M4 12h.01M4 17h.01',
  confidence: 'M12 21s7-4.3 7-11a7 7 0 0 0-14 0c0 6.7 7 11 7 11ZM9 11l2 2 4-5',
  creative: 'M4 20l4-1 10-10a2.8 2.8 0 0 0-4-4L4 15v5ZM13 6l5 5',
  focus: 'M12 3v3M12 18v3M3 12h3M18 12h3M7.8 7.8l-2-2M18.2 18.2l-2-2M16.2 7.8l2-2M5.8 18.2l2-2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  screen: 'M4 5h16v11H4V5ZM9 20h6M12 16v4',
  mentor: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  gamepad:
    'M7 10h2M8 9v2M15 10h.01M18 10h.01M8 6h8a5 5 0 0 1 4.7 3.3l1 3A3 3 0 0 1 18.8 16H18l-2-2H8l-2 2h-.8a3 3 0 0 1-2.9-3.7l1-3A5 5 0 0 1 8 6Z',
  calendar: 'M7 3v4M17 3v4M4 8h16M5 5h14v16H5V5ZM8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01',
  check: 'M5 12l4 4L19 6',
  clock: 'M12 7v5l3 3M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7ZM21 21v-2a4 4 0 0 0-3-3.87M16.5 4.2a3.5 3.5 0 0 1 0 6.6',
  phone: 'M5 4h4l2 5l-2.5 1.5a15 15 0 0 0 6 6L16 14l5 2v4a2 2 0 0 1-2.2 2C10.6 21.4 2.6 13.4 3 5.2A2 2 0 0 1 5 4Z',
  chevronDown: 'M6 9l6 6l6-6',
  mail: 'M4 4h16v16H4V4ZM4 8l8 6 8-6',
};

export function Icon({ name, className = 'h-6 w-6', strokeWidth = 2 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}