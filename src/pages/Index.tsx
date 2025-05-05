import PaletteGenerator from "@/components/PaletteGenerator";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Palette } from "lucide-react";

const Index = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
    <div>
      <PaletteGenerator />
    </div>
  );
};

const MobileLayout = () => {
  return (
    <div>
      <PaletteGenerator />
    </div>
  );
};

export default Index;
