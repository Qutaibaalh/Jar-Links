import { useState } from "react";
import { useGetStats, getGetStatsQueryKey } from "@workspace/api-client-react";
import type { GetStatsRange } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, MousePointerClick, Users, Eye } from "lucide-react";

const RANGES: { label: string; value: GetStatsRange }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "All time", value: "all" },
];

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1668FF]/10 text-[#1668FF]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-[#101113]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcode, setPasscode] = useState<string | null>(null);
  const [range, setRange] = useState<GetStatsRange>("30d");

  const params = { passcode: passcode ?? "", range };
  const { data, isLoading, isError, error } = useGetStats(params, {
    query: {
      queryKey: getGetStatsQueryKey(params),
      enabled: passcode !== null,
      retry: false,
    },
  });

  const unauthorized =
    isError && (error as { status?: number } | undefined)?.status === 401;

  if (passcode === null || unauthorized) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#E9EDF0] px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#1668FF]" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPasscode(passcodeInput);
              }}
              className="flex flex-col gap-3"
            >
              <Input
                type="password"
                placeholder="Enter passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                autoFocus
              />
              {unauthorized && (
                <p className="text-sm text-red-600">
                  Incorrect passcode. Try again.
                </p>
              )}
              <Button
                type="submit"
                className="bg-[#1668FF] hover:bg-[#1257d6]"
              >
                View dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="min-h-[100dvh] w-full bg-[#E9EDF0] px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-[#101113]">
              <BarChart3 className="h-6 w-6 text-[#1668FF]" />
              Ajar Links Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Engagement for your link-in-bio page
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border bg-white p-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  range === r.value
                    ? "bg-[#1668FF] text-white"
                    : "text-[#101113] hover:bg-black/5"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <p className="py-12 text-center text-muted-foreground">Loading…</p>
        )}

        {isError && !unauthorized && (
          <p className="py-12 text-center text-red-600">
            Couldn’t load analytics. Please try again.
          </p>
        )}

        {data && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={Eye} label="Profile visits" value={data.totalVisits} />
              <StatCard
                icon={Users}
                label="Unique visitors"
                value={data.uniqueVisitors}
              />
              <StatCard
                icon={MousePointerClick}
                label="Total clicks"
                value={data.totalClicks}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clicks by link</CardTitle>
              </CardHeader>
              <CardContent>
                {data.links.length === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground">
                    No clicks recorded yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Link</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.links.map((l) => (
                        <TableRow key={l.title}>
                          <TableCell className="font-medium">{l.title}</TableCell>
                          <TableCell className="text-right">{l.clicks}</TableCell>
                          <TableCell className="text-right">{pct(l.ctr)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Traffic sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.trafficSources.length === 0 ? (
                    <p className="py-4 text-sm text-muted-foreground">
                      No visits recorded yet.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {data.trafficSources.map((s) => (
                        <li
                          key={s.source}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-[#101113]">{s.source}</span>
                          <span className="font-semibold">{s.visits}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Campaigns (UTM)</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.campaigns.length === 0 ? (
                    <p className="py-4 text-sm text-muted-foreground">
                      No campaign traffic yet.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {data.campaigns.map((c) => (
                        <li
                          key={c.campaign}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-[#101113]">{c.campaign}</span>
                          <span className="font-semibold">{c.visits}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
