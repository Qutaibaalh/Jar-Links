import { Router, type IRouter } from "express";
import { and, eq, gte, sql, type SQL } from "drizzle-orm";
import { db, analyticsEventsTable } from "@workspace/db";
import { GetStatsQueryParams, GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();
const t = analyticsEventsTable;

router.get("/stats", async (req, res): Promise<void> => {
  const parsed = GetStatsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const expected = process.env.ANALYTICS_ADMIN_PASSCODE;
  if (!expected || parsed.data.passcode !== expected) {
    res.status(401).json({ error: "Invalid passcode" });
    return;
  }

  const range = parsed.data.range ?? "30d";
  const rangeDays = range === "7d" ? 7 : range === "30d" ? 30 : null;
  const since = rangeDays
    ? new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000)
    : null;
  const timeCond: SQL | undefined = since
    ? gte(t.createdAt, since)
    : undefined;

  const intVal = sql<number>`count(*)::int`;

  const [visitsRow] = await db
    .select({ value: intVal })
    .from(t)
    .where(and(eq(t.type, "visit"), timeCond));
  const totalVisits = visitsRow?.value ?? 0;

  const [uniqueRow] = await db
    .select({ value: sql<number>`count(distinct ${t.visitorId})::int` })
    .from(t)
    .where(and(eq(t.type, "visit"), timeCond));
  const uniqueVisitors = uniqueRow?.value ?? 0;

  const [clicksRow] = await db
    .select({ value: intVal })
    .from(t)
    .where(and(eq(t.type, "click"), timeCond));
  const totalClicks = clicksRow?.value ?? 0;

  const linkRows = await db
    .select({ title: t.linkTitle, url: t.linkUrl, clicks: intVal })
    .from(t)
    .where(and(eq(t.type, "click"), timeCond))
    .groupBy(t.linkTitle, t.linkUrl)
    .orderBy(sql`count(*) desc`);

  const links = linkRows.map((r) => ({
    title: r.title ?? "Unknown",
    url: r.url ?? null,
    clicks: r.clicks,
    ctr: totalVisits > 0 ? r.clicks / totalVisits : 0,
  }));

  const sourceRows = await db
    .select({ domain: t.referrerDomain, visits: intVal })
    .from(t)
    .where(and(eq(t.type, "visit"), timeCond))
    .groupBy(t.referrerDomain)
    .orderBy(sql`count(*) desc`);

  const trafficSources = sourceRows.map((r) => ({
    source: r.domain ?? "Direct",
    visits: r.visits,
  }));

  const campaignRows = await db
    .select({ campaign: t.utmCampaign, visits: intVal })
    .from(t)
    .where(
      and(
        eq(t.type, "visit"),
        sql`${t.utmCampaign} is not null`,
        timeCond,
      ),
    )
    .groupBy(t.utmCampaign)
    .orderBy(sql`count(*) desc`);

  const campaigns = campaignRows.map((r) => ({
    campaign: r.campaign ?? "Unknown",
    visits: r.visits,
  }));

  res.json(
    GetStatsResponse.parse({
      rangeDays,
      totalVisits,
      uniqueVisitors,
      totalClicks,
      links,
      trafficSources,
      campaigns,
    }),
  );
});

export default router;
