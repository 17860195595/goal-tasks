import { useState } from "react";
import { Calendar as CalendarIcon, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import PeriodSelector from "./PeriodSelector";

export default function GoalInputBar({
  value,
  onChange,
  period,
  onPeriodChange,
  onKeyPress,
  onGenerate,
  isGenerating,
  disabled,
}) {
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);

  return (
    <div 
      className="fixed left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        paddingTop: '12px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <div className="max-w-md mx-auto space-y-3">
        <AnimatePresence>
          {showPeriodSelector && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <PeriodSelector value={period} onChange={onPeriodChange} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPeriodSelector(!showPeriodSelector)}
            className={`flex-shrink-0 w-10 h-10 rounded-full mb-1 transition-colors ${
              showPeriodSelector ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Textarea
              value={value}
              onChange={onChange}
              onKeyPress={onKeyPress}
              placeholder="描述您的阶段性目标..."
              className="min-h-[44px] max-h-32 pr-12 resize-none rounded-full border-gray-300 focus:border-primary focus:ring-primary text-sm"
              disabled={disabled}
              rows={1}
              style={{ 
                lineHeight: '20px', 
                paddingTop: '12px', 
                paddingBottom: '12px',
                paddingLeft: '16px',
                paddingRight: '48px'
              }}
            />
            <div className="absolute right-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
              <Button
                onClick={onGenerate}
                disabled={!value.trim() || isGenerating}
                size="icon"
                className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 shadow-md"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

