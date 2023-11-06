/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";

function Display({ count }: { count: number }) {
  return <div>Count: {count}</div>;
}

export const ReactDisplay = qwikify$(Display);

export const ReactIncrementor = qwikify$(
  function ({ onClick }: { onClick: () => void }) {
    return <button onClick={() => onClick()}>Increment</button>;
  },
  { eagerness: "hover" },
);
