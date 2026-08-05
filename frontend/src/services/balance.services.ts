import { httpGet, httpPost } from "@/axios";
import type {
  BalanceTypes,
  CreateSettlementFormPayload,
  SettlementTypes,
} from "@/types/balance.types";

// get balances
export const getBalances = async (group_id: string) => {
  const response = await httpGet<BalanceTypes>(`/group/${group_id}/balance/`);
  return response.data;
};

// get settlements
export const getSettlements = async (group_id: string) => {
  const response = await httpGet<SettlementTypes>(
    `/group/${group_id}/simplify/`,
  );
  return response.data;
};

// create settlements
export const createSettlement = async ({
  group_id,
  formData,
}: {
  group_id: string;
  formData: CreateSettlementFormPayload;
}) => {
  const response = await httpPost(`/group/${group_id}/settlement/`, formData);

  return response.data;
};
