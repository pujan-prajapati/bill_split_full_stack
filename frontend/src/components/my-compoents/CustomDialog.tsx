import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomDialog = ({
  onOpenChange,
  open,
  title,
  children,
  className,
}: CustomDialogProps) => {
  return (
    <Dialog disablePointerDismissal open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("md:max-w-xl", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator />
        {children}
      </DialogContent>
    </Dialog>
  );
};
