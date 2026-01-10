import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateGoalHeader({ showBackButton = true, onBack }) {
  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 relative">
      <div className="flex items-center justify-center relative">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="h-8 w-8 absolute left-0 z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 text-center">
          创建目标
        </h1>
      </div>
    </div>
  );
}

