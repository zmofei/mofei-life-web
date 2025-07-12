// Google Analytics 4 (gtag) type declarations

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set' | 'get',
      targetId: string,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

export {};