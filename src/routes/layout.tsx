import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { Form, type RequestHandler } from "@builder.io/qwik-city";
import { useAuthSession, useAuthSignin, useAuthSignout } from "./plugin@auth";
import CSS from "./layout.css?inline";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  useStylesScoped$(CSS);
  const user = useAuthSession();
  const signinAction = useAuthSignin();
  const signoutAction = useAuthSignout();
  return (
    <div>
      <header>
        {user.value?.user ? (
          <Form action={signoutAction}>
            {user.value.user.image && (
              <img width={25} height={25} src={user.value.user.image} />
            )}
            {user.value.user.name}
            <button>signout</button>
          </Form>
        ) : (
          <Form action={signinAction}>
            <button>signin</button>
          </Form>
        )}
      </header>
      <Slot />
      <footer>Made with love by Builder.io!!!</footer>
    </div>
  );
});
