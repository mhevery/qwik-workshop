## Lesson 2: Setup Authentication with auth.js

**GitHub**: [Start](https://github.com/mhevery/qwik-workshop/tree/lesson-1) => [End](https://github.com/mhevery/qwik-workshop/tree/lesson-2) ([diff](https://github.com/mhevery/qwik-workshop/compare/lesson-1...lesson-2))

1. Install `auth.js` using: `npm run qwik add auth` (See detailed instructions here)
2. update `vite.config.js` to include:
   ```typescript
   optimizeDeps: {
     include: ["@auth/core"];
   }
   ```
3. Follow instructions in `.env` file to create a GitHub OAuth App.
4. Update `src/routes/plugin@auth.ts` with `PRIVATE_` prefix for the GitHub access token.
5. Update `src/routes/layout.ts`:

   ```typescript
   import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
   import {
     useAuthSession,
     useAuthSignout,
     useAuthSignin,
   } from "./plugin@auth";
   import { Form, useLocation } from "@builder.io/qwik-city";
   import CSS from "./layout.css?inline";

   export default component$(() => {
     useStylesScoped$(CSS);
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
                   {user.image && (
                     <img src={user.image} width={30} height={30} />
                   )}
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
   ```

6. Add `src/routes/layout.css`:

   ```css
   header {
     display: flex;
     justify-content: right;
     border-bottom: 1px solid #ccc;
   }

   img {
     border-radius: 50%;
     vertical-align: middle;
     padding: 0.5em;
   }
   ```

Review:

1. Installed `auth.js` using `npm run qwik add auth`
2. Updated `vite.config.js` to include `@auth/core` in `optimizeDeps`
3. Created GitHub OAuth App and updated `.env` file with the client id and secret.
4. Update the layout to show the user name and sign out button.
5. Use `$routeAction()` to sign in and sign out.
6. Pass data between `route*$()` methods
