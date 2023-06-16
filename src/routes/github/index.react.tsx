/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";

export function Hello({ onIncrement }: { onIncrement: () => unknown }) {
  return (
    <div>
      <h1>
        <button onClick={() => onIncrement()}>+</button>
      </h1>
    </div>
  );
}

export const HelloReact = qwikify$(Hello, { eagerness: "hover" });

export const DisplayReact = qwikify$(({ count }: { count: number }) => {
  return <div>Count: {count}</div>;
});
