import { httpDelete, httpGet, httpPost } from "@/axios";
import type {
  AddGroupMemberType,
  GroupMemberResponse,
  RemoveGroupMemberType,
} from "@/types/group.types";

// get all group members
export const getAllGroupMembers = async (group_id: string) => {
  const response = await httpGet<GroupMemberResponse>(
    `group/${group_id}/members/`,
  );
  return response.data;
};

// add group member
export const addGroupMember = async ({
  username,
  group_id,
}: AddGroupMemberType) => {
  const response = await httpPost(`group/${group_id}/members/`, { username });
  return response.data;
};

// remove group member
export const removeGroupMember = async ({
  group_id,
  user_id,
}: RemoveGroupMemberType) => {
  const response = await httpDelete(`group/${group_id}/members/${user_id}/`);
  return response.data;
};

// leave group
export const leaveGroup = async (group_id: string) => {
  const response = await httpDelete(`group/${group_id}/leave/`);
  return response.data;
};
