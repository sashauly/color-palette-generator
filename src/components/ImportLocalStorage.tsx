import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import type { LocalStorageData } from "@/types";
import JSZip from "jszip";

interface ImportLocalStorageProps {
  onImportSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (error: any) => void;
  isImporting: boolean;
  setIsImporting: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImportLocalStorage: React.FC<ImportLocalStorageProps> = ({
  onImportSuccess,
  onImportError,
  isImporting,
  setIsImporting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsImporting(true);

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);

      const jsonFile = content.file("localStorage_data.json");
      if (!jsonFile) {
        throw new Error("localStorage_data.json not found in the archive.");
      }

      const jsonContent = await jsonFile.async("string");
      const importedData: LocalStorageData = JSON.parse(jsonContent);

      for (const key in importedData) {
        if (Object.prototype.hasOwnProperty.call(importedData, key)) {
          const value = importedData[key as keyof LocalStorageData];
          try {
            localStorage.setItem(
              key,
              typeof value === "string" ? value : JSON.stringify(value)
            );
          } catch (error) {
            console.error(error);
          }
        }
      }

      onImportSuccess?.();
    } catch (error) {
      console.error("Error importing data:", error);
      onImportError?.(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Input
        type="file"
        accept=".zip"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button
        type="submit"
        variant="outline"
        onClick={handleButtonClick}
        disabled={isImporting}
        className={`w-full sm:w-auto ${
          isImporting ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        <Import className={isImporting ? "animate-pulse" : ""} />
        Import from a file
      </Button>
    </>
  );
};

export default ImportLocalStorage;
