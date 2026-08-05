import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardResponseTypes } from "@/types/dashboard.types";

export const description = "A bar chart";

const colors = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const chartConfig = {
  total: {
    label: "Amount",
    color: "#fb542b",
  },
} satisfies ChartConfig;

export const DashboardBarChart = ({
  data,
}: {
  data: DashboardResponseTypes;
}) => {
  const chartData = data.data.category_expenses.map((item, index) => ({
    category: item.expense_category__title,
    total: item.total,
    fill: colors[index % colors.length],
  }));

  return (
    <Card className="shadow-md flex-1">
      <CardHeader>
        <CardTitle>Expense by Category</CardTitle>
        <CardDescription>Your spending breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="#fb542b" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
