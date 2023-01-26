export interface User {
  id: number;
  username: string;
  color: string;
  profilePicture: string;
}

export interface Member {
  user: User;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  avatar: string;
  members: Member[];
}
