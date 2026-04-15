export function Icon({ className, name, size = 20 }) {
  const sharedProps = {
    className,
    fill: "none",
    height: size,
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    width: size,
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...sharedProps}>
          <path d="M4 5h7v6H4z" />
          <path d="M13 5h7v4h-7z" />
          <path d="M13 11h7v8h-7z" />
          <path d="M4 13h7v6H4z" />
        </svg>
      );
    case "users":
      return (
        <svg {...sharedProps}>
          <path d="M16 19a4 4 0 0 0-8 0" />
          <circle cx="12" cy="9" r="3.5" />
          <path d="M20 19a3 3 0 0 0-3-3" />
          <path d="M17.5 6.5a3 3 0 0 1 0 5.9" />
        </svg>
      );
    case "teachers":
      return (
        <svg {...sharedProps}>
          <path d="M12 4 3 8l9 4 9-4-9-4Z" />
          <path d="M7 10.5V15c0 1.6 2.2 3 5 3s5-1.4 5-3v-4.5" />
          <path d="M21 9v4" />
        </svg>
      );
    case "activities":
      return (
        <svg {...sharedProps}>
          <path d="M8 3v3" />
          <path d="M16 3v3" />
          <rect height="16" rx="3" width="18" x="3" y="5" />
          <path d="M3 10h18" />
          <path d="M8 14h3" />
          <path d="M13 14h3" />
        </svg>
      );
    case "enrollments":
      return (
        <svg {...sharedProps}>
          <path d="M5 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5V4Z" />
          <path d="M9 9h6" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
          <path d="M5 4 3 6v12a2 2 0 0 0 2 2" />
        </svg>
      );
    case "search":
      return (
        <svg {...sharedProps}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );
    case "menu":
      return (
        <svg {...sharedProps}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...sharedProps}>
          <path d="M6 6 18 18" />
          <path d="M18 6 6 18" />
        </svg>
      );
    case "bell":
      return (
        <svg {...sharedProps}>
          <path d="M8 18h8" />
          <path d="M10 20a2 2 0 0 0 4 0" />
          <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-1.6a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0l-1.1-1.1a1 1 0 0 1 0-1.4l.1-.1A1 1 0 0 0 4.6 15a1 1 0 0 0-.9-.6H3.5a1 1 0 0 1-1-1v-1.6a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1.1-1.1a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1 1 0 0 1 1 1v1.6a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6Z" />
        </svg>
      );
    case "help":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.6 9.1a2.7 2.7 0 0 1 5 1.3c0 1.6-1.8 2.2-2.5 3.1-.3.4-.4.7-.4 1.3" />
          <path d="M12 17.4h.01" />
        </svg>
      );
    case "spark":
      return (
        <svg {...sharedProps}>
          <path d="m12 3 1.4 4.2L17.6 9l-4.2 1.4L12 14.6l-1.4-4.2L6.4 9l4.2-1.8L12 3Z" />
          <path d="m18.5 3 .6 1.9L21 5.5l-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z" />
          <path d="m5 14 .8 2.4L8.2 17l-2.4.8L5 20.2l-.8-2.4L1.8 17l2.4-.6L5 14Z" />
        </svg>
      );
    case "plus":
      return (
        <svg {...sharedProps}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "logout":
      return (
        <svg {...sharedProps}>
          <path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...sharedProps}>
          <path d="M8 3v3" />
          <path d="M16 3v3" />
          <rect height="16" rx="3" width="18" x="3" y="5" />
          <path d="M3 10h18" />
        </svg>
      );
    case "user":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "clock":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5l3 1.5" />
        </svg>
      );
    case "check":
      return (
        <svg {...sharedProps}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "warning":
      return (
        <svg {...sharedProps}>
          <path d="m12 3 9 16H3L12 3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "filter":
      return (
        <svg {...sharedProps}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      );
    case "download":
      return (
        <svg {...sharedProps}>
          <path d="M12 4v10" />
          <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
          <path d="M5 19h14" />
        </svg>
      );
    case "edit":
      return (
        <svg {...sharedProps}>
          <path d="m4 20 4.5-1 9-9a2.1 2.1 0 1 0-3-3l-9 9L4 20Z" />
          <path d="m13.5 7.5 3 3" />
        </svg>
      );
    default:
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
