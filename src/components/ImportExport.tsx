import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/store";
import { exportToZip } from "@/utils/helpers";
import { toast } from "sonner";
import ImportLocalStorage from "./ImportLocalStorage";

const ImportExport = () => {
  const state = useAppSelector((state) => state.palette);

  const handleExport = async () => {
    try {
      await exportToZip(state);
      toast.success("Your color palettes have been exported");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("There was an error exporting your data");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleExport} variant="outline" className="flex-1">
          Export Palettes (ZIP)
        </Button>

        <ImportLocalStorage
          onImportSuccess={() =>
            toast.success("Your color palettes have been imported")
          }
          onImportError={(error) =>
            toast.error("There was an error importing your data", error)
          }
        />
      </div>
    </div>
  );
};

export default ImportExport;
