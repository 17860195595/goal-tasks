import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const DialogContext = React.createContext({
  onOpenChange: () => {},
});

const Dialog = ({ open, onOpenChange, children, className }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const content = (
    <DialogContext.Provider value={{ onOpenChange }}>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
              onClick={() => onOpenChange(false)}
            />
            {/* Dialog Content - 确保在屏幕正中间 */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-hidden pointer-events-auto flex flex-col",
                  className
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
};

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-4", className)}
    {...props}
  />
);

const DialogTitle = ({ className, ...props }) => (
  <h2
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const DialogDescription = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

const DialogContent = ({ className, children, ...props }) => (
  <div className={cn("p-4 pt-0 overflow-auto flex-1", className)} {...props}>
    {children}
  </div>
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4", className)}
    {...props}
  />
);

const DialogClose = ({ className, ...props }) => {
  const { onOpenChange } = React.useContext(DialogContext);
  
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </Button>
  );
};

export {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogClose,
};

