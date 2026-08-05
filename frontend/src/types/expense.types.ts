export type ExpensesTypes = {
  id: number;
  title: string;
  amount: string;
  expense_category: number;
  payer: number;
  payer_name: string;
  split_type: "equal" | "exact" | "percentage";
  participants: {
    user: number;
    share_amount: string;
    percentage: string;
  }[];
};

export type ExpensesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExpensesTypes[];
};

export type ExpensesPayloadTypes = {
  title: string;
  amount: string;
  expense_category: number;
  payer: number;
  split_type: "equal" | "exact" | "percentage";
  participants: {
    user: number;
    share_amount?: string;
    percentage?: string;
  }[];
};

export type ExpenseCategoryTypes = {
  id: number;
  title: string;
};
