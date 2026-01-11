import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const goalsMock = [
  { id: "g1", title: "React Basics", daysTotal: 30, daysDone: 12 },
  { id: "g2", title: "Node + Express", daysTotal: 14, daysDone: 9 },
  { id: "g3", title: "LeetCode Warm-up", daysTotal: 21, daysDone: 18 },
];

// 计算百分比（0-100）
function getPercent(goal) {
  if (!goal.daysTotal) return 0;
  const p = Math.round((goal.daysDone / goal.daysTotal) * 100);
  return Math.max(0, Math.min(100, p));
}

// 按 40/60/80/100 分段给颜色（Tailwind class）
function getBarClass(percent) {
  if (percent >= 100) return "bg-emerald-500";
  if (percent >= 80) return "bg-blue-500";
  if (percent >= 60) return "bg-amber-500";
  return "bg-rose-500"; // <60（包含 0-59）
}

export default function HomePage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Your Goals</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track progress by days completed.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Legend（旁边标注） */}
            <Legend />

            {/* Goals list */}
            <div className="space-y-4">
              {goalsMock.map((g) => {
                const percent = getPercent(g);
                return (
                  <div key={g.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{g.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {g.daysDone}/{g.daysTotal} days
                        </div>
                      </div>

                      <div className="text-sm font-semibold tabular-nums">
                        {percent}%
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${getBarClass(percent)}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Optional: color tag text */}
                    <div className="mt-2 text-xs text-muted-foreground">
                      Status: {statusText(percent)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function statusText(p) {
  if (p >= 100) return "100% (Done)";
  if (p >= 80) return "80–99%";
  if (p >= 60) return "60–79%";
  return "0–59%";
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <LegendItem color="bg-rose-500" text="0–59%" />
      <LegendItem color="bg-amber-500" text="60–79%" />
      <LegendItem color="bg-blue-500" text="80–99%" />
      <LegendItem color="bg-emerald-500" text="100%" />
    </div>
  );
}

function LegendItem({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}
