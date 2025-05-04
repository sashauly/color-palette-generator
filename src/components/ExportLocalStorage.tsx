import type React from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import type { LocalStorageData } from "@/types";
import JSZip from "jszip";

interface ExportLocalStorageProps {
  fileName?: string;
  isExporting: boolean;
  setIsExporting: React.Dispatch<React.SetStateAction<boolean>>;
  onExportSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onExportError?: (error: any) => void;
}

const ExportLocalStorage: React.FC<ExportLocalStorageProps> = ({
  fileName = "localStorage_export.zip",
  isExporting,
  setIsExporting,
  onExportSuccess,
  onExportError,
}) => {
  const handleExport = async () => {
    const allData: LocalStorageData = {
      colorInputsOpen: true,
      colorStatisticsOpen: true,
      inputColors: [],
      paletteSize: 0,
      numSamples: 0,
      palettes: [],
      settingsOpen: true,
      usedPalettes: [],
    };

    setIsExporting(true);

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value !== null) {
            try {
              allData[key as keyof LocalStorageData] = JSON.parse(value);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              allData[key as keyof LocalStorageData] = value;
            }
          }
        } catch (error) {
          console.error(error);
          allData[key as keyof LocalStorageData] = `Error: ${key}`;
        }
      }
    }

    if (Object.keys(allData).length === 0) {
      console.warn("No data found");
      return;
    }

    try {
      const json = JSON.stringify(allData, null, 2);

      const zip = new JSZip();

      zip.file("localStorage_data.json", json);

      const blob = await zip.generateAsync({ type: "blob" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onExportSuccess?.();
    } catch (error) {
      console.error(error);
      onExportError?.(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`w-full sm:w-auto ${
        isExporting ? "opacity-75 cursor-not-allowed" : ""
      }`}
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className={isExporting ? "animate-pulse" : ""} />
      Export to a file
    </Button>
  );
};

export default ExportLocalStorage;
