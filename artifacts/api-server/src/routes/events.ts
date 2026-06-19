import { Router, type IRouter } from "express";
import { db, analyticsEventsTable } from "@workspace/db";
import { TrackEventBody } from "@workspace/api-zod";

const router: IRouter = Router();

function extractDomain(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const { hostname } = new URL(referrer);
    return hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

router.post("/events", async (req, res): Promise<void> => {
  const parsed = TrackEventBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid analytics event");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const event = parsed.data;
  const userAgent = req.get("user-agent") ?? null;

  await db.insert(analyticsEventsTable).values({
    type: event.type,
    linkTitle: event.linkTitle ?? null,
    linkUrl: event.linkUrl ?? null,
    visitorId: event.visitorId,
    referrer: event.referrer ?? null,
    referrerDomain: extractDomain(event.referrer),
    utmSource: event.utmSource ?? null,
    utmMedium: event.utmMedium ?? null,
    utmCampaign: event.utmCampaign ?? null,
    userAgent,
  });

  res.status(201).json({ ok: true });
});

export default router;
