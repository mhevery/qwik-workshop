import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const Clock = component$(() => {
  const time = useSignal("loading...");
  useVisibleTask$(() => {
    const update = () => (time.value = new Date().toLocaleTimeString());
    update();
    setInterval(update, 1000);
  });
  return <div>{time.value}</div>;
});
