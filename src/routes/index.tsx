import { cva } from "class-variance-authority";
import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import server$, { createServerAction$, createServerData$, createServerMultiAction$, redirect } from "solid-start/server";
import { ClickUp } from "~/lib/clickup";
import { Space, Team } from "~/lib/clickup.types";
import { getToken } from "~/lib/session";

const CarretIcon: Component = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

interface CheckboxProps {
  state: 'checked' | 'unchecked' | 'indeterminate';
  onChange: (state: CheckboxProps['state']) => void;
}

const Checkbox: Component<CheckboxProps> = (props) => {
  const styles: Record<Exclude<CheckboxProps['state'], undefined>, string> = {
    checked: 'bg-purple-600 border-purple-600',
    unchecked: 'border-gray-300',
    indeterminate: 'bg-purple-600 border-purple-600',
  }

  return (
    <button class={"w-4 h-4 rounded border-2 focus:ring-purple-600 focus:ring-2 focus:ring-offset-2 " + styles[props.state]} onClick={() => {
      props.onChange(props.state !== 'unchecked' ? 'unchecked' : 'checked')
    }}>

      <Show when={props.state === 'checked'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="text-white w-full h-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </Show>
      <Show when={props.state === 'indeterminate'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="text-white w-full h-full"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
            d="M5 12L19 12"
          />
        </svg>
      </Show>
    </button>
  );
}

const carretButton = cva(["ml-auto"], {
  variants: {
    open: {
      true: "",
      false: "rotate-180",
    },
    hidden: {
      true: "invisible",
    },
  },
});

interface SelectTreeItemProps {
  id?: string;
  label: string;
  children: SelectTreeItemProps[];
}

const SelectTreeItem: Component<SelectTreeItemProps> = (props) => {
  const [open, setOpen] = createSignal(true);

  const carretStyles = createMemo(() =>
    carretButton({ open: open(), hidden: props.children.length <= 0 })
  );

  return (
    <div class="flex flex-col">
      <div class="flex items-center mb-4 gap-2">
        <label class="text-sm font-medium flex flex-row gap-2 items-center">
          <Checkbox state='unchecked' onChange={() => { }} />
          {props.label}
        </label>

        <button class={carretStyles()} onClick={() => setOpen((val) => !val)}>
          <CarretIcon />
        </button>
      </div>
      <Show when={open()}>
        <div class="pl-4">
          <For each={props.children}>
            {(child) => <SelectTreeItem {...child} />}
          </For>
        </div>
      </Show>
    </div>
  );
};

interface DropdownProps {
  selectedId: string | null;
  onChange: (id: string | null) => void;
  items: {
    id: string;
    label: string;
    image?: string;
    color?: string;
  }[];
}

const DropdownItem: Component<DropdownProps['items'][number]> = (props) => {
  return (
    <div class="flex flex-row gap-2 items-center">
      <Show when={props.color} >
        <div class="w-4 h-4 rounded" style={{ "background-color": props.color }} />
      </Show>
      <Show when={props.image} >
        <img src={props.image} />
      </Show>
      <p>{props.label}</p>
    </div>
  )
}

const Dropdown: Component<DropdownProps> = (props) => {
  const [id, setId] = createSignal(props.selectedId);

  const selectedItem = createMemo(() => props.items.find((item) => item.id === id()));

  createEffect(() => props.onChange(id()))

  const [open, setOpen] = createSignal(false);

  return (
    <button
      class="relative px-3 py-2 flex flex-row items-center gap-2 rounded-lg border-2 border-neutral-500 focus:border-black"
      onClick={() => setOpen((val) => !val)}
    >
      <Show when={selectedItem()} keyed fallback={<p class="text-neutral-500">No Item Selected</p>}>
        {(item) => (
          <DropdownItem {...item} />
        )}
      </Show>
      <div class={carretButton({ open: open() })}>
        <CarretIcon />
      </div>
      <Show when={open()}>
        <div class="absolute top-[110%] border-2 border-neutral-500 rounded-lg overflow-x-hidden overflow-y-auto left-0 right-0">
          <For each={props.items}>
            {(item) => (
              <button class="px-3 bg-white w-full py-2 flex flex-row items-center border-b-[1px] border-neutral-300" onClick={() => setId(item.id)}>
                <DropdownItem {...item} />
              </button>
            )}
          </For>
        </div>
      </Show>
    </button>
  );
};

export function routeData({ params }: RouteDataArgs) {
  const teams = createServerData$(
    async (_, { request }) => {
      const token = await getToken(request);
      if (!token) {
        throw redirect("/login");
      }

      const response = await ClickUp.getTeams(token);

      if (ClickUp.isError(response)) {
        throw response.err;
      }

      console.log(response);

      return response.teams;
    }
  );

  return { teams };
}

export default function Home() {

  const data = useRouteData<typeof routeData>();

  const teams = createMemo(() => data.teams() ?? []);
  const dropdownItems = createMemo(() => teams().map(team => ({
    id: team.id,
    label: team.name,
    image: team.avatar,
    color: team.color,
  })));

  const [teamId, setTeamId] = createSignal<string | null>(null);

  const tree = server$(async function(this: { request: Request }, teamId: string) {
    const token = await getToken(this.request);

    if (!token) {
      throw redirect('/login');
    }

    const response = await ClickUp.getSpaces(token, teamId);

    if (ClickUp.isError(response)) {
      throw response.err;
    }

    return response.spaces;
  });

  createEffect(() => console.log(teamId()))

  const [spaces,] = createResource(teamId, tree);

  createEffect(() => console.log(spaces()));

  return (
    <main class="container flex flex-row">
      <div class="flex flex-col px-4 py-2">
        <Dropdown items={dropdownItems()} selectedId={teamId()} onChange={setTeamId} />
        <Show when={spaces()}>
          <For each={spaces()}>
            {(space) => (
              <SelectTreeItem label={space.name} id={space.id} children={[]} />
            )}
          </For>
        </Show>
      </div>
      <h1 class="text-3xl font-bold text-center mt-8">
        Welcome to Solid-Start!
      </h1>
      {spaces.loading}
      <pre>{JSON.stringify(spaces(), null, 2)}</pre>
    </main>
  );
}
