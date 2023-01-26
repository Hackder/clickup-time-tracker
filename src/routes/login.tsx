import { children, Component, JSX, Show } from "solid-js";
import { A, ErrorMessage } from "solid-start";
import { createServerAction$, json, redirect } from "solid-start/server";
import Input from "~/components/Input";
import { ClickUp } from "~/lib/clickup";
import { setToken } from "~/lib/session";

export default function Login() {
  return (
    <main class="container mx-auto h-full flex flex-row justify-center items-center relative">
      <img
        src="/images/login-blob.svg"
        class="absolute -z-10 left-[40%] top-[35%] transform translate-x-[-50%] translate-y-[-50%]"
      />
      <LoginForm />
    </main>
  );
}

const LoginForm: Component = () => {
  const [loggingIn, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      const token = form.get("token") as string;
      const user = await ClickUp.getUser(token);
      if (user.err) {
        throw {
          err: "Invalid ClickUp Personal Token",
          fullError: user,
        };
      }
      const header = await setToken(request, token);
      return redirect("/", {
        headers: {
          "Set-Cookie": header,
        },
      });
    }
  );

  return (
    <Form class="flex flex-col gap-4 py-8 px-12 rounded-2xl w-[32em] shadow-lg bg-white">
      <h1 class="font-bold text-3xl text-center">Login</h1>
      <Input
        label="ClickUp Personal Token"
        name="token"
        error={loggingIn.error?.err}
        autocomplete="false"
        autofocus
        required
      />
      <Button type="submit" loading={loggingIn.pending}>
        Login
      </Button>
      <small class="text-center">
        Learn how to obtain your ClickUp Personal Token{" "}
        <A
          class="text-purple-600 underline"
          target="blank"
          href="https://clickup.com/api/developer-portal/authentication#generate-your-personal-api-token"
        >
          here
        </A>
        .
      </small>
    </Form>
  );
};

const Button: Component<
  {
    children: JSX.Element;
    loading: boolean;
  } & JSX.InputHTMLAttributes<HTMLInputElement>
> = (props) => {
  const c = children(() => props.children);
  return (
    <button class="px-3 py-2.5 rounded-lg bg-purple-500 text-white font-bold hover:bg-purple-600 flex flex-row justify-center items-center gap-3">
      <Show when={!props.loading} fallback={<LoadingSpinner />}>
        {c()}
      </Show>
    </button>
  );
};

// Circular loading spinner
const LoadingSpinner: Component = () => {
  return (
    <svg
      class="animate-spin"
      width="1.5em"
      height="1.5em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
        fill="currentColor"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        fill="currentColor"
      />
    </svg>
  );
};
