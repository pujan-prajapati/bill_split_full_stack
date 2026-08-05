import {
  ExpenseCreateDialog,
  ExpenseEmptyCreateDialog,
} from "./ExpenseCreateDialog";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Loading } from "../my-compoents/Loading";
import { useGetAllExpenses } from "@/hooks/expense.hook";
import { useParams } from "@tanstack/react-router";
import { CustomDialog } from "../my-compoents/CustomDialog";
import { ExpenseForm } from "./ExpenseForm";
import { useState } from "react";
import type { ExpensesTypes } from "@/types/expense.types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ExpenseDetails = () => {
  const { group_id } = useParams({ from: "/(home)/group/$group_id" });
  const [page, setPage] = useState(1);

  const [selectedExpense, setSelectedExpense] = useState<ExpensesTypes | null>(
    null,
  );

  const { data, isPending, error } = useGetAllExpenses(group_id, page );

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <h1>Error loading expenses</h1>;
  }

  return (
    <section>
      {/* create expense button if expenses are none */}

      {data?.results.length === 0 ? (
        <ExpenseEmptyCreateDialog />
      ) : (
        <ExpenseCreateDialog />
      )}

      <div className="mt-4 space-y-3">
        {data &&
          data.results.map((expense) => (
            <Card
              key={expense.id}
              onClick={() => setSelectedExpense(expense)}
              className="cursor-pointer shadow shadow-orange-300 hover:shadow-md transition duration-150"
            >
              <CardContent className="flex items-center justify-between">
                <div>
                  <h1 className="capitalize text-lg flex items-center gap-2 font-semibold text-gray-600">
                    {expense.title}{" "}
                    <Badge
                      className={cn(
                        expense.split_type === "equal" && "bg-green-600",
                        expense.split_type === "exact" && "bg-purple-600",
                        expense.split_type === "percentage" && "bg-amber-600",
                      )}
                    >
                      {expense.split_type}
                    </Badge>
                  </h1>
                  <h1 className="italic text-gray-600">
                    Paid by{" "}
                    <span className="capitalize font-semibold text-orange-700">
                      {expense.payer_name}
                    </span>
                  </h1>
                </div>

                <h1 className="text-lg font-semibold text-orange-700">
                  Rs. {expense.amount}
                </h1>
              </CardContent>
            </Card>
          ))}
      </div>

      {data.results.length > 0 && (
        <div className="flex items-center gap-2 justify-end mt-4">
          <Button onClick={() => setPage(page - 1)} disabled={!data.previous}>
            <ChevronLeft />
          </Button>
          <Button onClick={() => setPage(page + 1)} disabled={!data.next}>
            <ChevronRight />
          </Button>
        </div>
      )}

      <CustomDialog
        title={selectedExpense?.title || "Edit Expense"}
        open={!!selectedExpense}
        onOpenChange={() => setSelectedExpense(null)}
      >
        {selectedExpense && (
          <ExpenseForm
            closeDialog={() => setSelectedExpense(null)}
            expenseData={selectedExpense}
          />
        )}
      </CustomDialog>
    </section>
  );
};
