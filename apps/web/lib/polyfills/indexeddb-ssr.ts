// Polyfill for indexedDB during SSR
// This prevents "ReferenceError: indexedDB is not defined" during server-side rendering
if (typeof window === 'undefined') {
  // @ts-ignore - We're intentionally polyfilling a global
  global.indexedDB = undefined;
}

