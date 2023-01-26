import { Component, JSX, Show } from 'solid-js';

const Input: Component<{
  label: string;
  error: string;
} & JSX.InputHTMLAttributes<HTMLInputElement>
> = (props) => {
  return (
    <label class="flex flex-col gap-1">
      <span class="text-sm font-bold">{props.label}</span>
      <input class="px-3 py-2 rounded-lg border-2 border-neutral-500 focus:border-black" {...props} />
      <Show when={!!props.error}>
        <small class="text-red-500">{props.error}</small>
      </Show>
    </label>
  )
};

export default Input;
