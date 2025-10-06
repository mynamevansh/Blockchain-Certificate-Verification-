// Optional: Separate router configuration file
// src/config/router.js

export const routerConfig = {
  future: {
    // Enable React Router v7 compatibility
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    
    // Additional flags you might need in the future:
    // v7_fetcherPersist: true,        // For data fetchers
    // v7_normalizeFormMethod: true,   // For form handling
    // v7_partialHydration: true,      // For SSR/hydration
  },
};

// Usage in App.js:
// import { routerConfig } from './config/router';
// <Router {...routerConfig}>