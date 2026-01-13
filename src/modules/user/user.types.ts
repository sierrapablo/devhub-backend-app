export interface UserAuth {
  id: string;
  email: string;
  token: string;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  active: boolean;
  verified: boolean;
}
