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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleColorStatisticsOpen } from "@/store/uiSlice";

export const ColorStatistics: React.FC = () => {
  const { colorStatisticsOpen: isOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const { statistics, inputColors, generatedPalettes } = useAppSelector(
    (state) => state.palette
  );

  const positions = Object.keys(statistics)
    .map(Number)
    .sort((a, b) => a - b);

  const hasUsedPalettes = generatedPalettes.some((palette) => palette.used);

  const getColorData = (position: number) => {
    const positionStats = statistics[position] || {};

    return Object.entries(positionStats)
      .map(([colorValue, count]) => ({
        colorValue,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <Card className="py-4">
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
            <p>
              The number of times each color appears in the generated palettes
              (only used palettes).
            </p>
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {/* TODO remove old statistics */}
            {/* {Object.keys(statistics).length === 0 ? (
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
            )} */}

            {!hasUsedPalettes ? (
              <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">
                  Mark some palettes as used to view color statistics
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Position-based Color Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Color</TableHead>
                            {positions.map((position) => (
                              <TableHead key={position}>
                                Position {position}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inputColors.map((color) => (
                            <TableRow key={color.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-6 w-6 rounded-full border"
                                    style={{ backgroundColor: color.value }}
                                  />
                                  <span>{color.value}</span>
                                </div>
                              </TableCell>
                              {positions.map((position) => (
                                <TableCell key={`${color.value}-${position}`}>
                                  {statistics[position]?.[color.value] || 0}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {positions.map((position) => {
                  const colorData = getColorData(position);
                  if (colorData.length === 0) return null;

                  return (
                    <Card key={position}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Position {position} Color Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={colorData}>
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
                              {colorData.map((entry, index) => (
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
