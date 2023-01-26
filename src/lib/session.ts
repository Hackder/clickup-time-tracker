import { createCookieSessionStorage } from "solid-start";

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
  },
});

export async function getToken(request: Request): Promise<string> {
  const cookie = request.headers.get("Cookie") ?? "";
  const session = await storage.getSession(cookie);
  const token = session.get("token");
  return token;
}

export async function setToken(
  request: Request,
  token: string
): Promise<string> {
  const cookie = request.headers.get("Cookie") ?? "";
  const session = await storage.getSession(cookie);
  session.set("token", token);
  return storage.commitSession(session);
}
