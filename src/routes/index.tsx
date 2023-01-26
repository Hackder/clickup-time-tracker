import { cva } from "class-variance-authority";
import { children, Component, createMemo, createSignal, JSX, Show } from "solid-js";

const carretButton = cva(['ml-auto'], {
  variants: {
    open: {
      true: '',
      false: 'rotate-180'
    },
    hidden: {
      true: 'invisible'
    }
  }
});

const SelectTreeItem: Component<{
  name?: string;
  label: string;
  children?: JSX.Element;
}> = (props) => {
  const [open, setOpen] = createSignal(true);

  const c = children(() => props.children);

  const carretStyles = createMemo(() => carretButton({ open: open(), hidden: !c() }));

  return (
    <div class="flex flex-col">
      <div class="flex items-center mb-4 gap-2">
        <input id="default-checkbox" type="checkbox" name={props.name} value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
        <label for="default-checkbox" class="text-sm font-medium">{props.label}</label>

        <button class={carretStyles()} onClick={() => setOpen((val) => !val)}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <Show when={open()}>
        <div class="pl-4">
          {c()}
        </div>
      </Show>
    </div>
  )
}

export default function Home() {
  return (
    <main class="container flex flex-row">
      <div class="flex flex-col px-4 py-2">
        <SelectTreeItem label="Item 1">
          <SelectTreeItem label="Item 1.1" />
          <SelectTreeItem label="Item 1.2">
          <SelectTreeItem label="Item 1.2.1" />
          </SelectTreeItem>
          <SelectTreeItem label="Item 1.3" />
        </SelectTreeItem>
      </div>
      <h1 class="text-3xl font-bold text-center mt-8">Welcome to Solid-Start!</h1>
    </main>
  );
}
