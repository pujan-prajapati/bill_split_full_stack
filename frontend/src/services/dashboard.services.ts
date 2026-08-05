import { httpGet } from "@/axios";
import type { DashboardResponseTypes } from "@/types/dashboard.types";

export const getDashboard = async () => {
  const response = await httpGet<DashboardResponseTypes>("/dashboard/");
  return response.data;
};
