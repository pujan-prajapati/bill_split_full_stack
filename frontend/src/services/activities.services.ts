import { httpGet } from "@/axios";
import type { ActivityResponse } from "@/types/activity";

export const getActivity = async (page: number) => {
  const response = await httpGet<ActivityResponse>("/activity/", {
    page,
  });
  return response.data;
};
