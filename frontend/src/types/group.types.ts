export type CreateGroupPayload = {
  name: string;
  description: string;
  image?: File;
  created_by?: number;
};

export type Group = {
  id: number;
  name: string;
  description: string;
  image: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type GetAllGroupsResponse = {
  group: Group[];
};

export type GroupResponse = {
  group: Group;
};

type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar: string;
};

export type GroupMemberResponse = {
  group_members: {
    id: number;
    user: User;
    role: "owner" | "member";
    joined_at: string;
  }[];
};

export type AddGroupMemberType = {
  group_id: string;
  username: string;
};

export type RemoveGroupMemberType = {
  group_id: string;
  user_id: string;
};
