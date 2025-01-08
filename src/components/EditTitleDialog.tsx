import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditTitleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (value: string) => void;
  onSave: () => void;
}

export function EditTitleDialog({
  open,
  onOpenChange,
  title,
  onTitleChange,
  onSave,
}: EditTitleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px] max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Conversation Title</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit the title of your conversation.
        </DialogDescription>
        <Textarea
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          autoFocus
          className="max-h-[200px]"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave();
            }
          }}
        />
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
