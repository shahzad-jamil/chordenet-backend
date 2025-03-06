export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
};

export type UserData = {
  username: string;
  email: string;
  password: string;
};
