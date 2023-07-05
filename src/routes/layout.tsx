import {
  component$,
  Slot,
  useStylesQrl,
  useStylesScoped$,
} from "@builder.io/qwik";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { useAuthSession, useAuthSignin } from "./plugin@auth";
import { Form } from "@builder.io/qwik-city";
import CSS from "./layout.css?inline";

export default component$(() => {
  useStylesScoped$(CSS);
  const session = useAuthSession();
  const signinAction = useAuthSignin();
  return (
    <>
      <Header />
      <div>
        {session.value ? (
          <Form>
            {session.value.user?.image && (
              <img width="30" height="30" src={session.value.user.image} />
            )}
            <span>{session.value.user?.name}</span>
            <button>Signout</button>
          </Form>
        ) : (
          <Form action={signinAction}>
            <button>Signin</button>
          </Form>
        )}
      </div>
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});
