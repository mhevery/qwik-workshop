import { component$, useSignal, $, noSerialize } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

export default component$(() => {
  const count = useSignal(0);
  console.log("SECRET", count.value);
  return (
    <div>
      Count: {count.value}
      <button
        onClick$={async () => {
          count.value++;
          await server$(function () {
            const key = new String(
              this.env.get("PUBLIC_BUILDER_API_KEY")
            ) as any;
            noSerialize(key);
            const key2 = "" + key;
            noSerialize(key2 as any);
            console.log("SERVER", key == (count.value as any));
            return $(() => console.log("SERVER", key2 == (count.value as any)));
          })();
        }}
      >
        +1
      </button>
    </div>
  );
});
