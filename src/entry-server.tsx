import { redirect } from "solid-start";
import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server";
import { getToken } from "./lib/session";

const protectedPaths = ["/"];
export default createHandler(
  ({ forward }) => {
    return async (event) => {
      if (protectedPaths.includes(new URL(event.request.url).pathname)) {
        const user = await getToken(event.request);
        if (!user) {
          return redirect("/login");
        }
      }
      return forward(event);
    };
  },
  renderAsync((event) => <StartServer event={event} />)
);
