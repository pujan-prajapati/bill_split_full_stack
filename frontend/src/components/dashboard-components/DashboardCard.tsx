import { Card, CardContent } from "@/components/ui/card";
import type { DashboardResponseTypes } from "@/types/dashboard.types";
import { DollarSign, HandCoins, Users } from "lucide-react";

export const DashboardCard = (data: DashboardResponseTypes) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
      <Card className="shadow">
        <CardContent className="flex items-center gap-4">
          <div className="bg-orange-500 text-white p-3 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <h1 className="font-semibold text-gray-600">Total Groups</h1>
            <h1 className="text-2xl font-semibold text-orange-700">
              {data.data.total_groups}
            </h1>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardContent className="flex items-center gap-4">
          <div className="bg-green-500 text-white p-3 rounded-full">
            <DollarSign size={24} />
          </div>

          <div>
            <h1 className="font-semibold text-gray-600">Total Expenses</h1>
            <h1 className="text-2xl text-green-700 font-semibold">
              {data.data.total_expenses}
            </h1>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardContent className="flex items-center gap-4">
          <div className="bg-red-500 text-white p-3 rounded-full">
            <HandCoins size={24} />
          </div>
          <div>
            <h1 className="font-semibold text-gray-600">Total Spent</h1>
            <h1 className="text-2xl text-red-700 font-semibold">
              Rs. {data.data.total_spent}
            </h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
