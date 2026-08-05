export type ActivityTypes = {
  id: number;
  user_name: string;
  group_name: string;
  action: string;
  description: string;
  created_at: string;
};

export type ActivityResponse = {
  count: number;
  next: number;
  previous: number;
  results: ActivityTypes[];
};
