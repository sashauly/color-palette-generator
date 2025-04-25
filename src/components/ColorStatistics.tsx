import React from "react";
import type { ColorStatisticsType } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ColorStatisticsProps {
  statistics: ColorStatisticsType;
}

export const ColorStatistics: React.FC<ColorStatisticsProps> = ({
  statistics,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Position Statistics (Used Palettes Only)</CardTitle>
      </CardHeader>
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
    </Card>
  );
};
