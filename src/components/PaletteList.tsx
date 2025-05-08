import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Shuffle, Sparkles, Trash, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  clearAllPalettes,
  clearUsedPalettes,
  generatePalettesForPage,
  setGeneratedPalettes,
} from "@/store/paletteSlice";
import PaletteItem from "./PaletteItem";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  toggleAddUsedPaletteDialogOpen,
  setPaletteListFilter,
} from "@/store/uiSlice";
import { AddUsedPaletteDialog } from "./AddUsedPalette";

import { formatBigInt, shuffleColors } from "@/utils/helpers";
import MobilePaletteControls from "./MobilePaletteControls";
import { PaletteListFilter } from "@/types";

export const PaletteList: React.FC = () => {
  const { generatedPalettes, totalCombinations } = useAppSelector(
    (state) => state.palette
  );
  const { paletteListFilter: filter } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const handleShufflePalettes = () => {
    if (generatedPalettes.length === 0) return;

    const shuffled = shuffleColors(generatedPalettes);
    dispatch(setGeneratedPalettes(shuffled));
  };

  const handleClearAllPalettes = () => {
    dispatch(clearAllPalettes());
    dispatch(setPaletteListFilter("all"));
  };

  const handleClearUsedPalettes = () => {
    dispatch(clearUsedPalettes());
    dispatch(setPaletteListFilter("all"));
  };

  const handleOpenAddPaletteDialog = () => {
    dispatch(toggleAddUsedPaletteDialogOpen());
  };

  const filteredPalettes = generatedPalettes.filter((palette) => {
    if (filter === "used") return palette.used;
    if (filter === "unused") return !palette.used;
    return true;
  });

  const handleTabChange = (value: string) => {
    if (value === "all" || value === "used" || value === "unused") {
      dispatch(setPaletteListFilter(value as PaletteListFilter));
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap justify-between items-center gap-2">
            <h4 className="font-semibold">Color Palettes</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => dispatch(generatePalettesForPage())}
                variant="default"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </Button>

              <Button
                onClick={handleShufflePalettes}
                variant="outline"
                disabled={generatedPalettes.length === 0}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Shuffle
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            <p>
              Total possible unique palettes:{" "}
              <span className="font-semibold">
                {typeof totalCombinations === "bigint"
                  ? formatBigInt(totalCombinations)
                  : totalCombinations}
              </span>
            </p>
          </CardDescription>

          <div className="flex flex-wrap gap-2 items-center">
            <Button onClick={handleOpenAddPaletteDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Used Palette
            </Button>

            <Button
              onClick={handleClearUsedPalettes}
              variant="outline"
              disabled={!generatedPalettes.some((p) => p.used)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Clear Used
            </Button>

            <Button
              onClick={handleClearAllPalettes}
              variant="outline"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={generatedPalettes.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={filter} onValueChange={handleTabChange}>
            <TabsList className="flex flex-wrap w-full mb-2">
              <TabsTrigger value="all">
                All <span className="sr-only">palettes</span>
                <span className="rounded-full bg-muted text-muted-foreground border border-border px-2 py-1 text-xs font-medium">
                  {filteredPalettes.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="used"
                disabled={!filteredPalettes.some((p) => p.used)}
              >
                Used <span className="sr-only">palettes</span>
                <span className="rounded-full bg-muted text-muted-foreground border border-border px-2 py-1 text-xs font-medium">
                  {filteredPalettes.filter((p) => p.used).length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="unused" disabled={!filteredPalettes.length}>
                Unused <span className="sr-only">palettes</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredPalettes.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredPalettes.map((palette, index) => (
                <PaletteItem key={palette.id} index={index} palette={palette} />
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
        <MobilePaletteControls onShuffle={handleShufflePalettes} />
      </div>
    </>
  );
};
