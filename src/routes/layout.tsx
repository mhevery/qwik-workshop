import { component$, Slot } from "@builder.io/qwik";
import { useAuthSession, useAuthSignout, useAuthSignin } from "./plugin@auth";
import { Form, useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const session = useAuthSession();
  const authSignin = useAuthSignin();
  const authSignout = useAuthSignout();
  const location = useLocation();
  const user = session.value?.user;
  return (
    <>
      <header>
        <div>
          {user ? (
            <div>
              <Form action={authSignout}>
                {user.image && <img src={user.image} width={30} height={30} />}
                <span>
                  {user.name}({user.email})
                </span>
                <button>Sign Out</button>
              </Form>
            </div>
          ) : (
            <Form action={authSignin}>
              <input type="hidden" name="providerId" value="github" />
              <input
                type="hidden"
                name="options.callbackUrl"
                value={location.url.toString()}
              />
              <button>Sign In</button>
            </Form>
          )}
        </div>
      </header>
      <Slot />
    </>
  );
});
