import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  Settings,
  Shuffle,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocalStorage } from "@uidotdev/usehooks";

const MIN_PALETTE_SIZE = 2;
const MAX_PALETTE_SIZE = 6;

interface PaletteControlsProps {
  paletteSize: number;
  totalPossiblePalettes: number;
  numSamples: number;
  onPaletteSizeChange: (size: number) => void;
  onNumSamplesChange: (samples: number) => void;
  onShuffle: () => void;
  onClearUsed: () => void;
  onGenerate: () => void;
  onClearAll: () => void;
  isShuffling: boolean;
}

export const PaletteControls: React.FC<PaletteControlsProps> = ({
  paletteSize,
  numSamples,
  totalPossiblePalettes,
  onPaletteSizeChange,
  onNumSamplesChange,
  onShuffle,
  onClearUsed,
  onGenerate,
  onClearAll,
  isShuffling,
}) => {
  const [isOpen, setIsOpen] = useLocalStorage("settingsOpen", true);

  return (
    <Card className="py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings />
            Settings
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </CardTitle>
          <CardDescription>
            <p>Configure the palette generation process.</p>
            <p>You can generate up to a {totalPossiblePalettes} palettes.</p>
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              <Label
                htmlFor="palette-size"
                className="block text-sm font-medium"
              >
                Palette Size
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="range"
                  id="palette-size"
                  min={MIN_PALETTE_SIZE}
                  max={MAX_PALETTE_SIZE}
                  value={paletteSize}
                  onChange={(e) => onPaletteSizeChange(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-8 text-center font-medium">
                  {paletteSize}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="num-samples"
                className="block text-sm font-medium"
              >
                Number of Samples
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="range"
                  id="num-samples"
                  min="10"
                  max={totalPossiblePalettes}
                  step="5"
                  value={numSamples}
                  onChange={(e) => onNumSamplesChange(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-8 text-center font-medium">
                  {numSamples}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center sm:justify-start gap-2">
            <Button onClick={onGenerate} className="w-full sm:w-auto">
              <Sparkles />
              Generate
            </Button>

            <Button
              onClick={onShuffle}
              disabled={isShuffling}
              className={`w-full sm:w-auto
          ${isShuffling ? "opacity-75" : ""}
        `}
            >
              <Shuffle className={`${isShuffling ? "animate-spin" : ""}`} />
              Shuffle
            </Button>
            <Button
              variant="destructive"
              onClick={onClearUsed}
              className="w-full sm:w-auto"
            >
              <Trash2 />
              Clear Used
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={onClearAll}
              disabled={isShuffling}
            >
              <Trash2 />
              Clear
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
