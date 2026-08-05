export type DashboardResponseTypes = {
  data: {
    total_groups: number;
    total_expenses: number;
    total_spent: number;
    total_paid: number;
    total_debt: number;
    category_expenses: {
      expense_category__title: string;
      total: number;
    }[];
  };
};
