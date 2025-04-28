import React from "react";
import type { ColorStatisticsType } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartBar, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocalStorage } from "@uidotdev/usehooks";

interface ColorStatisticsProps {
  statistics: ColorStatisticsType;
}

export const ColorStatistics: React.FC<ColorStatisticsProps> = ({
  statistics,
}) => {
  const [isOpen, setIsOpen] = useLocalStorage("colorStatisticsOpen", true);

  return (
    <Card className="py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar />
            Color Position Statistics
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </CardTitle>
          <CardDescription>
            <p>
              The number of times each color appears in the generated palettes
              (only used palettes).
            </p>
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="flex justify-around">
            {Object.keys(statistics).length === 0 ? (
              <div>No statistics to display yet.</div>
            ) : (
              Object.entries(statistics).map(([position, colorCounts]) => (
                <div key={position}>
                  <h4 className="font-medium">Position {position}:</h4>
                  <ul>
                    {Object.entries(colorCounts).map(([color, count]) => (
                      <li key={color} className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-md border border-gray-200 dark:border-gray-700"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        <span className="text-sm font-medium">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
