type AnalyticsEventData = Record<string, string>;

declare global {
  interface Window {
    va?: (
      event: "event",
      payload: { name: string; data: AnalyticsEventData }
    ) => void;
    plausible?: (
      name: string,
      options: { props: AnalyticsEventData }
    ) => void;
    gtag?: (
      command: "event",
      name: string,
      properties: AnalyticsEventData
    ) => void;
  }
}

export function trackEvent(
  name: string,
  props: Record<string, string> = {}
): void {
  if (typeof window === "undefined") return;

  if (window.va) {
    window.va("event", { name, data: props });
  } else if (window.plausible) {
    window.plausible(name, { props });
  } else if (window.gtag) {
    window.gtag("event", name, props);
  }
}
