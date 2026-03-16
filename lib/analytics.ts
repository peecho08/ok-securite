import posthog from "posthog-js";

// ── Event name registry ─────────────────────────────────────────────

type AnalyticsEvent =
  | "checklist_started"
  | "checklist_completed"
  | "checklist_item_checked"
  | "team_created"
  | "team_joined"
  | "role_selected"
  | "subscription_checkout_started"
  | "subscription_activated"
  | "subscription_canceled"
  | "plan_page_viewed"
  | "pdf_downloaded"
  | "site_created"
  | "custom_checklist_created"
  | "invite_link_copied"
  | "search_used";

// ── Client-side (posthog-js) ────────────────────────────────────────

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, properties);
  } catch {
    // PostHog not initialised — no-op in dev / missing key
  }
}

export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(userId, traits);
  } catch {
    // no-op
  }
}

export function setUserProperties(properties: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    posthog.setPersonProperties(properties);
  } catch {
    // no-op
  }
}

// ── Server-side (posthog-node) ──────────────────────────────────────

let _serverClient: import("posthog-node").PostHog | null = null;

function getServerClient() {
  if (_serverClient) return _serverClient;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  // Dynamic import would be cleaner but we need sync access after first load
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PostHog } = require("posthog-node") as typeof import("posthog-node");
  _serverClient = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  return _serverClient;
}

export function trackServerEvent(
  userId: string,
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
) {
  const client = getServerClient();
  if (!client) return;
  client.capture({ distinctId: userId, event, properties });
}
