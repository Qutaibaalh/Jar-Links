import { trackEvent } from "@workspace/api-client-react";

const VISITOR_KEY = "ajar_visitor_id";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return `anon_${Math.random().toString(36).slice(2)}`;
  }
}

export function trackVisit(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    void trackEvent({
      type: "visit",
      visitorId: getVisitorId(),
      referrer: document.referrer || null,
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
    }).catch(() => {});
  } catch {
    /* never block the page */
  }
}

export function trackClick(linkTitle: string, linkUrl: string): void {
  try {
    void trackEvent({
      type: "click",
      visitorId: getVisitorId(),
      linkTitle,
      linkUrl,
    }).catch(() => {});
  } catch {
    /* never block the click */
  }
}
