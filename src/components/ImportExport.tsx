import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/store";
import { exportToZip } from "@/utils/helpers";
import { toast } from "sonner";
import ImportLocalStorage from "./ImportLocalStorage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Import/Export <span className="sr-only">palettes</span>
        </CardTitle>

        <CardDescription>
          Import or export your color palettes to a ZIP file.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-2">
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
      </CardContent>
    </Card>
  );
};

export default ImportExport;
