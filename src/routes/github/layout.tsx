import { Slot, component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useAuthSession, useAuthSignin, useAuthSignout } from "../plugin@auth";

export default component$(() => {
  const authSession = useAuthSession();
  const authSignout = useAuthSignout();
  const authSignin = useAuthSignin();
  return (
    <div>
      <header class="flex flex-row justify-end">
        {authSession.value?.user ? (
          <span>
            {authSession.value.user.name}
            {authSession.value.user.image && (
              <img
                width="32"
                height="32"
                src={authSession.value.user.image}
                class="m-5 inline h-8 w-8 rounded-full"
              />
            )}
            <Form action={authSignout} class="inline">
              <button class="btn btn-secondary">Sign Out</button>
            </Form>
          </span>
        ) : (
          <Form action={authSignin}>
            <button class="btn btn-secondary">SignIn</button>
          </Form>
        )}
      </header>
      <Slot />
    </div>
  );
});
