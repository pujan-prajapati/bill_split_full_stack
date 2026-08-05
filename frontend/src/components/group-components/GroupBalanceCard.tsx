import { Card, CardContent } from "../ui/card";
import { Loading } from "../my-compoents/Loading";
import { cn } from "@/lib/utils";
import { GroupSettlementDialog } from "./GroupSettlementDialog";
import { useGetBalances } from "@/hooks/settlement.hooks";
import { Badge } from "../ui/badge";

export const GroupBalanceCard = ({ groupId }: { groupId: string }) => {
  const { data, error, isPending } = useGetBalances(groupId);

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <h1>Error loading balances</h1>;
  }

  return (
    <>
      {data?.result?.length !== 0 && <GroupSettlementDialog />}

      <div className="mt-4 space-y-3">
        {data &&
          data.result.map((balance) => (
            <Card
              key={balance.user}
              className={cn(
                "shadow",
                balance.balance > 0
                  ? "shadow-green-200"
                  : balance.balance === 0
                    ? "shadow-gray-200"
                    : "shadow-red-200",
              )}
            >
              <CardContent className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                  {balance.name}
                </h1>

                <div>
                  <h1
                    className={cn(
                      "text-lg font-semibold flex items-center gap-2",
                      balance.balance > 0
                        ? "text-green-700"
                        : balance.balance === 0
                          ? "text-gray-700"
                          : "text-red-700",
                    )}
                  >
                    Rs. {balance.balance}{" "}
                    {balance.balance !== 0 && (
                      <Badge
                        className={cn(
                          "font-semibold italic",
                          balance.balance > 0 ? "bg-green-700" : "bg-red-700",
                        )}
                      >
                        {balance.balance > 0 ? "Owed" : "Debt"}
                      </Badge>
                    )}
                  </h1>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
};
