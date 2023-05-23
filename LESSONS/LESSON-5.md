## Lesson 5: Advanced concepts

**GitHub**: [Start](https://github.com/mhevery/qwik-workshop/tree/lesson-4) => [End](https://github.com/mhevery/qwik-workshop/tree/lesson-5) ([diff](https://github.com/mhevery/qwik-workshop/compare/lesson-4...lesson-5))

1. create `src/routes/github/index.tsx`

   ```typescript
   import { component$ } from "@builder.io/qwik";

   export default component$(() => {
     return <div>Hello Qwik!</div>;
   });
   ```

2. Add search input:
   ```typescript
   export default component$(() => {
     const filter = useSignal("");
     return (
       <div>
         <input type="text" bind:value={filter} />
       </div>
     );
   });
   ```
3. Add debounce logic:
   ```typescript
   const debouncedFilter = useSignal("");
   useTask$(({ track, cleanup }) => {
     track(filter);
     const id = setTimeout(() => (debouncedFilter.value = filter.value), 400);
     cleanup(() => clearTimeout(id));
   });
   ```
4. Add `server$()` service:

   ```typescript
   import type { paths } from "@octokit/openapi-types";

   type SearchUsersResponse =
     paths["/search/users"]["get"]["responses"]["200"]["content"]["application/json"];

   const fetchUsers = server$(async function (query: string) {
     const response = await fetch(
       "https://api.github.com/search/users?q=" + query,
       {
         headers: {
           "User-Agent": "Qwik Workshop",
           "X-GitHub-Api-Version": "2022-11-28",
           Authorization:
             "Bearer " + this.env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
         },
       }
     );
     const users = (await response.json()) as SearchUsersResponse;
     return users.items;
   });
   ```

5. Add `useResource$()`:
   ```typescript
   const users = useResource$(async ({ track }) => {
     track(debouncedFilter);
     return debouncedFilter.value
       ? await fetchUsers(debouncedFilter.value)
       : [];
   });
   return (
     <div>
       ...
       <ul>
         <Resource
           value={users}
           onPending={() => <>loading...</>}
           onResolved={(users) => (
             <>
               {users.map((user) => (
                 <ul key={user.id}>{user.login}</ul>
               ))}
             </>
           )}
         />
       </ul>
     </div>
   );
   ```

Review:

- Used `useTask$()` to create debounced signal.
- Used `useResource$()` to fetch data from GitHub.
- Used `server$()` to create a server side service.
- Used `Resource` component to render data.
