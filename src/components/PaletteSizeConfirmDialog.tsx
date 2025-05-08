import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "./ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Dialog,
  DialogContent,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "./ui/drawer";

interface PaletteSizeConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingSize: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const PaletteSizeConfirmDialog: React.FC<PaletteSizeConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  pendingSize,
  onConfirm,
  onCancel,
}) => {
  const isSmallDevice = useMediaQuery("(max-width: 768px)");

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>Confirm Palette Size Change</DialogTitle>
        <DialogDescription>
          Changing the palette size will clear all generated palettes, including
          your marked palettes. Are you sure you want to change to size{" "}
          {pendingSize}?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onConfirm}>Confirm Change</Button>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );

  if (isSmallDevice) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Confirm Palette Size Change</DrawerTitle>
            <DrawerDescription>
              Changing the palette size will clear all generated palettes,
              including your marked palettes. Are you sure you want to change to
              size {pendingSize}?
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>{content.props.children[1]}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">{content}</DialogContent>
    </Dialog>
  );
};

export default PaletteSizeConfirmDialog;
