import {
  createExpense,
  deleteExpense,
  getAllExpenseCategory,
  getAllExpenses,
  updateExpense,
} from "@/services/expense.services";
import type { ExpensesPayloadTypes } from "@/types/expense.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// use get all expenses
export const useGetAllExpenses = (group_id: string, page: number) => {
  return useQuery({
    queryKey: ["expenses", group_id, page],
    queryFn: () => getAllExpenses(group_id, page),
  });
};

// use get all expense category
export const useGetAllExpenseCategory = () => {
  return useQuery({
    queryKey: ["expense_categories"],
    queryFn: getAllExpenseCategory,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["balances"],
      });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      expense_id,
      formData,
    }: {
      expense_id: string;
      formData: ExpensesPayloadTypes;
    }) => updateExpense(expense_id, formData),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["balances"],
      });
    },
  });
};

// use delete expense
export const useExpenseGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
