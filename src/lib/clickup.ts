export const ClickUp = {
  getUser: async (token: string) => {
    const res = await fetch("https://api.clickup.com/api/v2/user", {
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  },
};
