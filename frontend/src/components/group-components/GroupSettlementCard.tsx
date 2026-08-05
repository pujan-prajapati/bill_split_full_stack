import { useParams } from "@tanstack/react-router";
import { Card, CardContent } from "../ui/card";
import { ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";
import { GroupSettlementForm } from "./GroupSettlementForm";
import { useGetSettlements } from "@/hooks/settlement.hooks";

export const GroupSettlementCard = () => {
  const { group_id } = useParams({ from: "/(home)/group/$group_id" });

  const { data } = useGetSettlements(group_id);

  if (data?.data.length === 0) {
    return (
      <h1 className="text-center text-lg font-semibold">
        No settlements pending.
      </h1>
    );
  }

  return (
    <div className="space-y-3">
      {data?.data.map((settlement, index) => (
        <Card key={index} className="hover:shadow-md transition duration-150">
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h1 className="capitalize text-red-700 text-lg font-semibold flex items-center gap-2">
                  {settlement.payer.name}
                </h1>
                <ArrowRight size={12} />
                <h1 className="capitalize text-green-700 text-lg font-semibold flex items-center gap-2">
                  {settlement.reciever.name}
                </h1>
              </div>
              <h1 className={"text-lg font-semibold text-orange-700"}>
                Rs. {settlement.amount}
              </h1>
            </div>

            <div>
              <Separator className="my-3" />
              <GroupSettlementForm settlement={settlement} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
