## Lesson 4: Setup Supabase

**GitHub**: [Start](https://github.com/mhevery/qwik-workshop/tree/lesson-3) => [End](https://github.com/mhevery/qwik-workshop/tree/lesson-4) ([diff](https://github.com/mhevery/qwik-workshop/compare/lesson-3...lesson-4))

1. `npm install @supabase/supabase-js supabase-auth-helpers-qwik` (Read more [here](https://qwik.builder.io/docs/integrations/supabase/).)
2. Setup Supabase account and create a new project.
3. Create a table: https://app.supabase.com/projects
4. Update `.env` file with the Supabase URL and public key.
5. Update `src/routes/github/[user]/[repo]/index.tsx`:

   ```typescript
   import {
     Form,
     routeAction$,
     routeLoader$,
     useLocation,
     z,
     zod$,
   } from "@builder.io/qwik-city";
   import { createServerClient } from "supabase-auth-helpers-qwik";

   export const useIsFavorite = routeLoader$(async (requestEv) => {
     const email = requestEv.sharedMap.get("session")?.user?.email as
       | string
       | undefined;
     const user = requestEv.params.user;
     const repo = requestEv.params.repo;
     if (email) {
       const supabaseClient = createServerClient(
         requestEv.env.get("PRIVATE_SUPABASE_URL")!,
         requestEv.env.get("PRIVATE_SUPABASE_ANON_KEY")!,
         requestEv
       );
       const { data: favorite, error } = await supabaseClient
         .from("favorite")
         .select("*")
         .eq("email", email)
         .eq("user", user)
         .eq("repo", repo);
       if (error) {
         console.log("ERROR", error);
         throw error;
       }
       console.log("IS FAVORITE", favorite?.length, email, user, repo);
       return (favorite?.length || 0) > 0;
     }
     return false;
   });

   export const useSetFavoriteAction = routeAction$(
     async ({ favorite }, requestEv) => {
       const email = requestEv.sharedMap.get("session")?.user?.email as
         | string
         | undefined;
       const user = requestEv.params.user;
       const repo = requestEv.params.repo;
       console.log("SET FAVORITE", favorite, email, user, repo);
       const supabaseClient = createServerClient(
         requestEv.env.get("PRIVATE_SUPABASE_URL")!,
         requestEv.env.get("PRIVATE_SUPABASE_ANON_KEY")!,
         requestEv
       );
       if (email) {
         await supabaseClient
           .from("favorite")
           .delete()
           .eq("email", email)
           .eq("user", user)
           .eq("repo", repo);
       }
       if (favorite && email) {
         await supabaseClient.from("favorite").upsert({
           email,
           user,
           repo,
         });
       }
     },
     zod$({ favorite: z.coerce.boolean() })
   );
   ```

   ```typescript
   export default component$(() => {
     ...
     const isFavorite = useIsFavorite();
     const setFavoriteAction = useSetFavoriteAction();
     ...
     return (
         ...
         <div>
           <b>Repo:</b> {repository.value.name}
           <Form action={setFavoriteAction}>
             <input
               type="hidden"
               name="favorite"
               value={isFavorite.value ? "" : "true"}
             />
             <button style={{ color: isFavorite.value ? "red" : "gray" }}>
               {isFavorite.value ? "★" : "☆"}
             </button>
           </Form>
         </div>
         ...
     );
   });
   ```

Review:

1. Setup Supabase account and create a new project.
2. Used `routeLoader$()` to fetch data from Supabase.
3. Used `routeAction$()` to update data in Supabase.
4. Used `Form` to submit data to Supabase.
