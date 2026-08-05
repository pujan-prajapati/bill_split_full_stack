import { httpDelete, httpGet, httpPost, httpPut } from "@/axios";
import type {
  ExpenseCategoryTypes,
  ExpensesPayloadTypes,
  ExpensesResponse,
} from "@/types/expense.types";

// get all expenses
export const getAllExpenses = async (group_id: string, page: number) => {
  const response = await httpGet<ExpensesResponse>(
    `/expense?group_id=${group_id}`,
    { page },
  );
  return response.data;
};

// get all expense category
export const getAllExpenseCategory = async () => {
  const response = await httpGet<ExpenseCategoryTypes[]>("/expense/category/");
  return response.data;
};

// create expense
export const createExpense = async (formData: ExpensesPayloadTypes) => {
  const response = await httpPost("/expense/", formData);
  return response.data;
};

// update expense
export const updateExpense = async (
  expense_id: string,
  formData: ExpensesPayloadTypes,
) => {
  const response = await httpPut(`/expense/${expense_id}/`, formData);
  return response.data;
};

// delete expense
export const deleteExpense = async (expense_id: string) => {
  const response = await httpDelete(`/expense/${expense_id}/`);
  return response.data;
};
