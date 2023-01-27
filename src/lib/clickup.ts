import { AsyncClickUpResponse, ClickUpError, ClickUpResponse, Space, Team, User } from "./clickup.types";

export const ClickUp = {
  isError: <T>(response: ClickUpResponse<T>): response is ClickUpError => {
    return (response as ClickUpError).err !== undefined;
  },

  getUser: async (
    token: string
  ): AsyncClickUpResponse<{
    user: User;
  }> => {
    const res = await fetch("https://api.clickup.com/api/v2/user", {
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  },

  getTeams: async (
    token: string
  ): AsyncClickUpResponse<{
    teams: Team[];
  }> => {
    const res = await fetch("https://api.clickup.com/api/v2/team", {
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  },

  getSpaces: async (
    token: string,
    teamId: string,
  ): AsyncClickUpResponse<{
    spaces: Space[];
  }> => {
    const res = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/space`, {
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  },
};
