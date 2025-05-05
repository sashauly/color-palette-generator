import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import JSZip from "jszip";
import type { AppState } from "@/types";
import { useAppDispatch } from "@/store/store";
import { importState } from "@/store/paletteSlice";

interface ImportLocalStorageProps {
  onImportSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (error: any) => void;
}

const ImportLocalStorage: React.FC<ImportLocalStorageProps> = ({
  onImportSuccess,
  onImportError,
}) => {
  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);

      const jsonFile = content.file("localStorage_data.json");
      if (!jsonFile) {
        throw new Error("localStorage_data.json not found in the archive.");
      }

      const jsonContent = await jsonFile.async("string");
      const importedData: AppState = JSON.parse(jsonContent);

      for (const key in importedData) {
        if (Object.prototype.hasOwnProperty.call(importedData, key)) {
          const value = importedData[key as keyof AppState];
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

      dispatch(importState(importedData.palette));

      onImportSuccess?.();
    } catch (error) {
      console.error("Error importing data:", error);
      onImportError?.(error);
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
        className="hidden"
      />
      <Button
        type="submit"
        variant="outline"
        onClick={handleButtonClick}
        className={`flex-1`}
      >
        <Import />
        Import from a file
      </Button>
    </>
  );
};

export default ImportLocalStorage;
