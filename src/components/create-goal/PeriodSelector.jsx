import { useState, useMemo } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { format, differenceInDays, addDays, startOfDay, isBefore } from "date-fns";

export default function PeriodSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('start'); // 当前选择步骤：'start' 或 'end'
  
  // 获取当前时间（今天开始）
  const today = useMemo(() => startOfDay(new Date()), []);
  
  const [dateRange, setDateRange] = useState(() => {
    // 默认起始时间为当前时间
    const startDate = today;
    // 如果有值，计算结束日期
    const days = parseInt(value) || 30;
    const endDate = addDays(startDate, days - 1);
    return { from: startDate, to: endDate };
  });

  const commonPeriods = [7, 14, 21, 30, 60, 90];

  // 禁用日期：根据步骤不同，禁用不同的日期
  const disabledDates = useMemo(() => {
    return (date) => {
      const dateStart = startOfDay(date);
      
      if (step === 'start') {
        // 选择起始时间：只禁用今天之前的日期
        return isBefore(dateStart, today);
      } else {
        // 选择结束时间：禁用今天之前的日期，以及早于起始时间的日期
        if (isBefore(dateStart, today)) {
          return true;
        }
        if (dateRange.from && isBefore(dateStart, startOfDay(dateRange.from))) {
          return true;
        }
        return false;
      }
    };
  }, [today, step, dateRange.from]);

  // 处理起始时间选择
  const handleStartDateSelect = (date) => {
    if (!date) return;
    
    let from = startOfDay(date);
    
    // 确保起始时间不早于今天
    if (isBefore(from, today)) {
      from = today;
    }
    
    setDateRange({ from, to: null });
    setStep('end'); // 切换到选择结束时间
  };

  // 处理结束时间选择（临时选择，不立即保存）
  const handleEndDateSelect = (date) => {
    if (!date || !dateRange.from) return;
    
    let to = startOfDay(date);
    const from = startOfDay(dateRange.from);
    
    // 确保结束时间不早于起始时间
    if (isBefore(to, from)) {
      to = from;
    }
    
    // 只更新临时状态，不立即保存和关闭
    setDateRange({ from, to });
  };

  // 确认选择并关闭模态框
  const handleConfirmSelection = () => {
    if (dateRange.from && dateRange.to) {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      onChange({ target: { value: days.toString() } });
      setIsOpen(false);
      setStep('start'); // 重置步骤
    }
  };

  // 打开模态框时重置步骤
  const handleOpenDialog = () => {
    setIsOpen(true);
    setStep('start');
  };

  const handleQuickSelect = (days) => {
    const startDate = today;
    const endDate = addDays(startDate, days - 1);
    const newRange = { from: startDate, to: endDate };
    setDateRange(newRange);
    onChange({ target: { value: days.toString() } });
    setIsOpen(false);
  };

  const currentDays = dateRange.from && dateRange.to 
    ? differenceInDays(dateRange.to, dateRange.from) + 1 
    : parseInt(value) || 30;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        目标周期（天）
      </label>
      
      {/* 快速选择按钮 */}
      <div className="flex gap-2 flex-wrap">
        {commonPeriods.map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => handleQuickSelect(period)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentDays === period
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {period}天
          </button>
        ))}
      </div>

      {/* 日历选择器按钮 */}
      <Button
        type="button"
        variant="outline"
        onClick={handleOpenDialog}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dateRange.from && dateRange.to ? (
          <>
            {format(dateRange.from, "yyyy年MM月dd日")} - {format(dateRange.to, "yyyy年MM月dd日")}
            <span className="ml-2 text-xs text-gray-500">({currentDays}天)</span>
          </>
        ) : (
          "选择日期范围"
        )}
      </Button>

      {/* 模态框日历 */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setStep('start'); // 关闭时重置步骤
        }
      }}>
        <DialogHeader>
          <DialogTitle>
            {step === 'start' ? '选择起始时间' : '选择结束时间'}
          </DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            {/* 显示已选择的起始时间和结束时间 */}
            {step === 'end' && dateRange.from && (
              <div className="text-sm text-gray-600 text-center space-y-1">
                <div>起始时间：{format(dateRange.from, "yyyy年MM月dd日")}</div>
                {dateRange.to && (
                  <div className="font-medium text-primary">
                    结束时间：{format(dateRange.to, "yyyy年MM月dd日")}
                    <span className="ml-2 text-xs text-gray-500">
                      (共 {differenceInDays(dateRange.to, dateRange.from) + 1} 天)
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-center py-2">
              {step === 'start' ? (
                <Calendar
                  mode="single"
                  defaultMonth={dateRange.from || today}
                  selected={dateRange.from}
                  onSelect={handleStartDateSelect}
                  disabled={disabledDates}
                  numberOfMonths={1}
                  className="rounded-lg"
                />
              ) : (
                <Calendar
                  mode="range"
                  defaultMonth={dateRange.from || today}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to
                  }}
                  onSelect={(range) => {
                    if (!range) {
                      return;
                    }
                    
                    // 在第二步时，from 已经设置，用户点击日期会将其设为结束时间
                    if (range.to) {
                      // 用户选择了结束时间（临时选择，不立即保存）
                      handleEndDateSelect(range.to);
                    } else if (range.from) {
                      // 如果用户点击了新的起始时间（虽然不应该发生，因为已禁用），重新选择起始时间
                      if (range.from.getTime() !== dateRange.from?.getTime()) {
                        handleStartDateSelect(range.from);
                      }
                    }
                  }}
                  disabled={disabledDates}
                  numberOfMonths={1}
                  className="rounded-lg"
                />
              )}
            </div>
            
            {/* 操作按钮（在选择结束时间时显示） */}
            {step === 'end' && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('start');
                    // 重置结束时间
                    setDateRange({ from: dateRange.from, to: null });
                  }}
                  className="text-sm flex-1"
                >
                  重新选择起始时间
                </Button>
                {dateRange.to && (
                  <Button
                    onClick={handleConfirmSelection}
                    className="text-sm flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    确定
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
