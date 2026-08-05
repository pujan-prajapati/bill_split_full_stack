import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardResponseTypes } from "@/types/dashboard.types";

export const description = "A simple pie chart";

const chartConfig = {
  amount: {
    label: "Amount",
  },
  Paid: {
    label: "Paid",
    color: "#22c55e",
  },
  Debt: {
    label: "Debt",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export const DashboardPieChart = ({
  data,
}: {
  data: DashboardResponseTypes;
}) => {
  const chartData = [
    {
      status: "Paid",
      amount: data.data.total_paid,
      fill: "#22c55e",
    },
    {
      status: "Debt",
      amount: data.data.total_debt,
      fill: "#ef4444",
    },
  ].filter((item) => item.amount > 0);

  return (
    <Card className="flex flex-col flex-1 shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Paid Vs Debt</CardTitle>
        <CardDescription>Your Current Balance</CardDescription>
      </CardHeader>
      {chartData.length === 0 ? (
        <CardContent>
          <h1 className="text-gray-600">No payment data available</h1>
        </CardContent>
      ) : (
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="amount" nameKey="status" />
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
};
