import { Card } from "@/components/ui/card";

export default function GoalInfoCard({ goalInfo, totalTasks }) {
  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-50 border-primary/20">
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">目标</h3>
        <p className="text-gray-700 text-sm">{goalInfo.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>周期：{goalInfo.period} 天</span>
          <span>任务：{totalTasks} 个</span>
        </div>
      </div>
    </Card>
  );
}

