import React from "react";
import { Button } from "@/components/ui/button";
import { Shuffle, Sparkles } from "lucide-react";
import { Label } from "./ui/label";

interface MobilePaletteControlsProps {
  onShuffle: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
}

const MobilePaletteControls: React.FC<MobilePaletteControlsProps> = ({
  onShuffle,
  onGenerate,
  isGenerating,
  isShuffling,
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-card/90 backdrop-blur-md z-50 p-2 border-t border-border">
      <div className="container mx-auto flex items-center justify-center-safe flex-wrap gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={onGenerate}
            disabled={isGenerating}
            aria-label="Generate Palettes"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Label className="text-xs">Generate</Label>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={onShuffle}
            disabled={isShuffling}
            aria-label="Shuffle Palettes"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Label className="text-xs">Shuffle</Label>
        </div>
      </div>
    </div>
  );
};

export default MobilePaletteControls;
