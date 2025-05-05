import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shuffle, Sparkles, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  clearAllPalettes,
  clearUsedPalettes,
  generatePalettesForPage,
  setPalettes,
} from "@/store/paletteSlice";
import PaletteItem from "./PaletteItem";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { toggleAddUsedPaletteDialogOpen } from "@/store/uiSlice";
import { AddUsedPaletteDialog } from "./AddUsedPalette";

import { formatBigInt, shuffleColors } from "@/utils/helpers";
import MobilePaletteControls from "./MobilePaletteControls";

export const PaletteList: React.FC = () => {
  const { generatedPalettes, totalCombinations } = useAppSelector(
    (state) => state.palette
  );
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("all");

  const handleShufflePalettes = () => {
    if (generatedPalettes.length === 0) return;

    const shuffled = shuffleColors(generatedPalettes);
    dispatch(setPalettes(shuffled));
  };

  const handleClearAllPalettes = () => {
    dispatch(clearAllPalettes());
    dispatch(setPalettes([]));
  };

  const handleClearUsedPalettes = () => {
    dispatch(clearUsedPalettes());
  };

  const handleOpenAddPaletteDialog = () => {
    dispatch(toggleAddUsedPaletteDialogOpen());
  };

  const filteredPalettes = generatedPalettes.filter((palette) => {
    if (filter === "used") return palette.used;
    if (filter === "unused") return !palette.used;
    return true;
  });

  return (
    <>
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">Color Palettes</div>
            <div className="flex flex-wrap gap-2">
              {/* The "Generate" button now implicitly triggers generation
                  by changing inputColors or paletteSize */}
              {/* You might keep a "Regenerate Current Page" button if needed */}
              <Button
                onClick={() => dispatch(generatePalettesForPage())}
                variant="default"
                className="flex-shrink-0"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </Button>
              <Button
                onClick={handleShufflePalettes}
                variant="outline"
                disabled={generatedPalettes.length === 0}
                className="flex-shrink-0"
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Shuffle
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            <span>
              Total possible unique palettes:{" "}
              {typeof totalCombinations === "bigint"
                ? formatBigInt(totalCombinations)
                : totalCombinations}
            </span>

            {totalCombinations === 0 && (
              <span>
                Adjust input colors and palette size to generate palettes.
              </span>
            )}
          </CardDescription>
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleClearAllPalettes}
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                disabled={
                  generatedPalettes.length === 0 && totalCombinations === 0
                }
              >
                <Trash className="mr-2 h-4 w-4" />
                Clear All
              </Button>
              <Button
                onClick={handleClearUsedPalettes}
                variant="outline"
                className="flex-shrink-0"
                disabled={!generatedPalettes.some((p) => p.used)}
              >
                Clear Used
              </Button>
            </div>
          </div>
          <Button onClick={handleOpenAddPaletteDialog}>Add Used Palette</Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="used">Used</TabsTrigger>
              <TabsTrigger value="unused">Unused</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredPalettes.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredPalettes.map((palette) => (
                <PaletteItem key={palette.id} palette={palette} />
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                {totalCombinations === 0
                  ? "Adjust input colors and palette size to generate palettes."
                  : "No palettes match your filter on the current page."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddUsedPaletteDialog />

      <div className="md:hidden block">
        <MobilePaletteControls
          onShuffle={handleShufflePalettes}
        />
      </div>
    </>
  );
};
