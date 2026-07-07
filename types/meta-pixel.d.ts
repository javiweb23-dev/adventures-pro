export {};

declare global {
  interface Window {
    fbq?: (
      command: "init" | "track",
      eventName: string,
      data?: Record<string, unknown>,
      options?: { eventID?: string },
    ) => void;
    _fbq?: Window["fbq"];
  }
}
