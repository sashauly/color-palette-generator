import { Palette } from "lucide-react";
import PaletteGenerator from "./components/PaletteGenerator";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            <Palette className="inline-block w-10 h-10 mr-2" />
            Color Palette Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create unique color combinations where order matters
          </p>
        </header>
        <main>
          <PaletteGenerator />
        </main>
        <footer className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Color Palette Generator. All rights
            reserved.
          </p>
        </footer>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
