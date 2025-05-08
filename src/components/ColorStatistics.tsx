import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { toggleColorStatisticsOpen } from "@/store/uiSlice";

export const ColorStatistics: React.FC = () => {
  const { colorStatisticsOpen: isOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const { statistics, generatedPalettes } = useAppSelector(
    (state) => state.palette
  );

  const positions = Object.keys(statistics)
    .map(Number)
    .sort((a, b) => a - b);

  const hasUsedPalettes = generatedPalettes.some((palette) => palette.used);

  const getColorDataForChart = (position: number) => {
    const positionStats = statistics[position] || {};

    return Object.entries(positionStats)
      .map(([colorValue, count]) => ({
        colorValue,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <Card>
      <Collapsible
        open={isOpen}
        onOpenChange={() => dispatch(toggleColorStatisticsOpen())}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Color Position Statistics
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </CardTitle>
          <CardDescription>
            The number of times each color appears in the generated palettes
            (only used palettes), grouped by position.
          </CardDescription>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            {!hasUsedPalettes ? (
              <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">
                  Mark some palettes as used to view color statistics
                </p>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Position-based Color Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-around gap-4">
                    {Object.entries(statistics).map(
                      ([position, colorCounts]) => (
                        <div key={position}>
                          <h4 className="font-medium">Position {position}:</h4>
                          <ul>
                            {Object.entries(colorCounts).map(
                              ([color, count]) => (
                                <li
                                  key={color}
                                  className="flex items-center space-x-2"
                                >
                                  <div
                                    className="w-4 h-4 rounded-md border border-gray-200 dark:border-gray-700"
                                    style={{
                                      backgroundColor: color,
                                    }}
                                  />
                                  <span className="text-sm font-medium">
                                    {count}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>

                {positions.map((position) => {
                  const colorDataForChart = getColorDataForChart(position);
                  const chartData = colorDataForChart.filter(
                    (entry) => entry.count > 0
                  );

                  if (chartData.length === 0) return null;

                  return (
                    <Card key={`chart-${position}`}>
                      <CardHeader>
                        <CardTitle>
                          Position {position} Color Usage Chart
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={chartData}>
                            <XAxis
                              dataKey="colorValue"
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number) => [
                                `${value} uses`,
                                "Usage",
                              ]}
                              labelFormatter={(color) => `Color: ${color}`}
                            />
                            <Bar dataKey="count">
                              {chartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.colorValue}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
