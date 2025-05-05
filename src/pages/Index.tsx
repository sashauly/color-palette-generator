import { ColorInput } from "@/components/ColorInput";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaletteSizeSelector from "@/components/PaletteSizeSelector";
import { PaletteList } from "@/components/PaletteList";
import { ColorStatistics } from "@/components/ColorStatistics";
import ImportExport from "@/components/ImportExport";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  // generatePalettesForPage,
  calculateAndUpdateStatistics,
} from "@/store/paletteSlice";
import { useEffect } from "react";

const Index = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { inputColors, paletteSize, generatedPalettes } =
    useAppSelector((state) => state.palette);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(generatePalettesForPage());
  // }, [inputColors, paletteSize, dispatch]);

  useEffect(() => {
    dispatch(calculateAndUpdateStatistics());
  }, [generatedPalettes, inputColors, paletteSize, dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <Palette className="inline-block w-10 h-10 mr-2" />
            Color Palette Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create unique color combinations where order matters
          </p>
        </header>

        <main>{isMobile ? <MobileLayout /> : <DesktopLayout />}</main>

        <footer className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Color Palette Generator. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

const DesktopLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-4 space-y-4">
        <ColorInput />

        <PaletteSizeSelector />

        <ImportExport />
      </div>
      <div className="lg:col-span-8 space-y-4">
        <PaletteList />

        <ColorStatistics />
      </div>
    </div>
  );
};

const MobileLayout = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="palettes">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="palettes">Palettes</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <ColorInput />

          <PaletteSizeSelector />

          <ImportExport />
        </TabsContent>

        <TabsContent value="palettes">
          <PaletteList />
        </TabsContent>

        <TabsContent value="stats">
          <ColorStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
