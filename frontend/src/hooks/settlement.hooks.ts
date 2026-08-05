import {
  createSettlement,
  getBalances,
  getSettlements,
} from "@/services/balance.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetBalances = (groupId: string) => {
  return useQuery({
    queryKey: ["balances"],
    queryFn: () => getBalances(groupId),
  });
};

export const useGetSettlements = (group_id: string) => {
  return useQuery({
    queryKey: ["settlements"],
    queryFn: () => getSettlements(group_id),
  });
};

export const useCreateSettlement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSettlement,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settlements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["balances"],
      });
    },
  });
};
