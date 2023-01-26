import { Team, User } from "./clickup.types";

export const ClickUp = {
  getUser: async (token: string): Promise<{
    user: User;
  }> => {
    const res = await fetch("https://api.clickup.com/api/v2/user", {
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  },

  getTeams: async (token: string): Promise<{
    teams: Team[];
  }> => {
    const res = await fetch("https://api.clickup.com/api/v2/team", {
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  }
};
