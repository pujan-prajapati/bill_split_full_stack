import { getActivity } from "@/services/activities.services";
import { getDashboard } from "@/services/dashboard.services";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
};

export const useGetActivities = (page: number) => {
  return useQuery({
    queryKey: ["activities", page],
    queryFn: () => getActivity(page),
  });
};
