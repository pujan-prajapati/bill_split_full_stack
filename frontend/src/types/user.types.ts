export type UserTypes = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type UserResponseType = {
  message: string;
  user: UserTypes;
};

export type LoginResponseTypes = {
  message: string;
  user: UserTypes;
  access_token: string;
};

export type RegisterUserPayloadTypes = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type LoginUserPayloadTypes = {
  email: string;
  password: string;
};

export type ChangePasswordPayloadTypes = {
  password: string;
  confirm_password: string;
};
