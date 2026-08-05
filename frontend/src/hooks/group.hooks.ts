import {
  createGroup,
  deleteGroup,
  getAllGroup,
  getGroupById,
  updateGroup,
} from "@/services/group.services";
import {
  addGroupMember,
  getAllGroupMembers,
  leaveGroup,
  removeGroupMember,
} from "@/services/groupMember.services";
import type {
  AddGroupMemberType,
  CreateGroupPayload,
} from "@/types/group.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// use get all groups
export const useGetGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroup,
  });
};

// use create group
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
};

// use get group by id
export const useGetGroupById = (group_id: string) => {
  return useQuery({
    queryKey: ["group", group_id],
    queryFn: () => getGroupById(group_id),
    enabled: !!group_id,
  });
};

// use update group
type UpdateGroupType = {
  group_id: string;
  formData: CreateGroupPayload;
};
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, group_id }: UpdateGroupType) =>
      updateGroup(group_id, formData),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["group", variables.group_id],
      });
    },
  });
};

// use delete group
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
};

// use get group members
export const useGetGroupMembers = (group_id: string) => {
  return useQuery({
    queryKey: ["group_members", group_id],
    queryFn: () => getAllGroupMembers(group_id),
  });
};

// use add member
export const useAddGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddGroupMemberType) => addGroupMember(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["group_members"],
      });
    },
  });
};

// remove member
export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeGroupMember,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["group_members", variables.group_id],
      });
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveGroup,

    onSuccess: (_, group_id) => {
      queryClient.invalidateQueries({
        queryKey: ["group_members", group_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
};
