import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

export default function CreateGoal() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return null;

    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return null;

    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Create a plan</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Main goal</Label>
            <Textarea placeholder="e.g., Complete React basics in 30 days" />
          </div>

          <div className="space-y-1">
            <Label>Final goal</Label>
            <Textarea placeholder="e.g., Build and deploy a mini React app, arrive the co-op level" />
          </div>

          <div className="space-y-1">
            <Label>Current level</Label>
            <Input placeholder="e.g., beginner / intermediate / advanced" />
          </div>

          <div className="space-y-1">
            <Label>Time range</Label>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <p className="text-sm">
              {totalDays === null
                ? "Select start & end date"
                : `Total: ${totalDays} day(s)`}
            </p>
          </div>

          <div className="space-y-1">
            <Label>average hours studied per day</Label>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              step={1}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key))
                  e.preventDefault();
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full text-black bg-white border">
              submit
            </Button>

            <Button className="w-full text-black bg-white border">reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
