export type SettlementTypes = {
  data: {
    payer: {
      id: number;
      name: string;
    };
    reciever: {
      id: number;
      name: string;
    };
    amount: number;
  }[];
};

export type BalanceTypes = {
  result: {
    user: number;
    name: string;
    balance: number;
  }[];
};

export type CreateSettlementFormPayload = {
  payer: number;
  reciever: number;
  amount: number;
};
