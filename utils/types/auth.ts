export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  hasSubscription: boolean;
};

export type UserData = {
  username: string;
  email: string;
  password: string;
};
