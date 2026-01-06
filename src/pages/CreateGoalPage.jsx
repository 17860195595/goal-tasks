import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function CreateGoal() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">
            创建一个阶段性目标
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Textarea
            placeholder="例如：30 天内完成 React 基础学习"
          />

          <Input
            type="number"
            placeholder="目标周期（天）"
          />

          <Input
            type="number"
            placeholder="目标总积分（默认 1000）"
          />

          <Button className="w-full">
            创建目标
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
