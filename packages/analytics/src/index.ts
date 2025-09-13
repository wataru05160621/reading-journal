export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export function track(event: AnalyticsEvent) {
  // placeholder: wire providers later
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${event.name}`, event.properties ?? {});
  }
}
