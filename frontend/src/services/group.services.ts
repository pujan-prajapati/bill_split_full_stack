import { httpDelete, httpGet, uploader } from "@/axios";
import type {
  CreateGroupPayload,
  GetAllGroupsResponse,
  GroupResponse,
} from "@/types/group.types";

// create group
export const createGroup = async (formData: CreateGroupPayload) => {
  const { image, ...data } = formData;
  const response = await uploader<CreateGroupPayload, GroupResponse>(
    "/group/",
    "POST",
    data,
    "image",
    image ?? null,
  );
  return response.data;
};

// get all group
export const getAllGroup = async () => {
  const response = await httpGet<GetAllGroupsResponse>("/group/");
  return response.data;
};

// get group by id
export const getGroupById = async (group_id: string) => {
  const response = await httpGet<GroupResponse>(`/group/${group_id}/`);
  return response.data;
};

// delete group
export const deleteGroup = async (group_id: string) => {
  const response = await httpDelete<GroupResponse>(`/group/${group_id}/`);
  return response.data;
};

// update group by id
export const updateGroup = async (
  group_id: string,
  formData: CreateGroupPayload,
) => {
  const { image, ...data } = formData;
  const response = await uploader(
    `/group/${group_id}/`,
    "PUT",
    data,
    "image",
    image ?? null,
  );
  return response.data;
};
