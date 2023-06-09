## Lesson 8: Let's style our app with Tailwind

**GitHub**: [Start](https://github.com/mhevery/qwik-workshop/tree/lesson-7) => [End](https://github.com/mhevery/qwik-workshop/tree/lesson-8) ([diff](https://github.com/mhevery/qwik-workshop/compare/lesson-7...lesson-8))

1. `npm run qwik add tailwind`

◇  👻  Ready?  Add tailwind to your app?
│
│  🐬 Modify
│     - package.json
│     - src/global.css
│
│  🌟 Create
│     - postcss.config.js
│     - tailwind.config.js
│
│  🐳 Overwrite
│     - .vscode/settings.json
│
│  💾 Install npm dependencies:
│     - autoprefixer ^10.4.14
│     - postcss ^8.4.23
│     - tailwindcss ^3.3.1
│
◇  Ready to apply the tailwind updates to your app?
│  `Yes looks good, finish update!`
│
◇  App updated
│
└  🦄  Success!  Added tailwind to your app

2. Modify `/src/global.css`
   remove this line --> @tailwind base;

3. Create `src/components/user/user.tsx`
   ```typescript
   import { component$ } from '@builder.io/qwik';

   type Props = {
      avatarUrl: string;
      login: string;
   };

   export const User = component$<Props>(({ login, avatarUrl }) => {
      return (
         <div class='flex container mx-auto p-4 mb-4 bg-slate-600 w-[350px] rounded-2xl overflow-hidden'>
            <img
               class='rounded-xl min-w-[150px] max-w-[150px]'
               height='150'
               width='150'
               src={avatarUrl}
               alt={login}
            />
            <div class='w-full flex flex-col justify-between items-center p-4'>
               <div class='mt-5 text-white text-md font-semibold text-ellipsis overflow-hidden'>
                  {login}
               </div>
               <a
                  class='flex items-center text-white text-md font-semibold bg-cyan-500 py-2 px-4 rounded-lg hover:bg-cyan-400'
                  href={`/github/${login}/`}
               >
                  Detail
               </a>
            </div>
         </div>
      );
   });
   ```

4. Replace `src/routes/github/index.tsx`
   
   ```
   import {
     Resource,
     component$,
     useResource$,
     useSignal,
     useTask$,
   } from "@builder.io/qwik";
   import { server$ } from "@builder.io/qwik-city";
   import type { paths } from "@octokit/openapi-types";
   import { User } from "~/components/user/user";

   type SearchUsersResponse =
     paths["/search/users"]["get"]["responses"]["200"]["content"]["application/json"];

   const fetchUsers = server$(async function (query: string) {
     const response = await fetch(
       "https://api.github.com/search/users?q=" + query,
       {
         headers: {
           "User-Agent": "Qwik Workshop",
           "X-GitHub-Api-Version": "2022-11-28",
           Authorization: "Bearer " + this.env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
         },
       }
     );
     const users = (await response.json()) as SearchUsersResponse;
     return users.items;
   });

   export default component$(() => {
     const filter = useSignal("");
     const debouncedFilter = useSignal("");
     useTask$(({ track, cleanup }) => {
       track(filter);
       const id = setTimeout(() => (debouncedFilter.value = filter.value), 400);
       cleanup(() => clearTimeout(id));
     });
     const users = useResource$(async ({ track }) => {
       track(debouncedFilter);
       return debouncedFilter.value ? await fetchUsers(debouncedFilter.value) : [];
     });
     return (
       <div>
         <div class='flex flex-col justify-center text-center'>
           <h1 class='text-slate-600 text-3xl mt-6 mb-2'>GitHub search</h1>
           <div class='flex items-center border p-2 rounded-md text-white w-[600px] mx-auto'>
             <input
               type='text'
               placeholder='Search...'
               bind:value={filter}
               class='w-full text-xl outline-none pl-4'
             />
           </div>
         </div>
         <div class='flex flex-wrap p-8' style='justify-content: space-between'>
           <Resource
             value={users}
             onPending={() => <span>Loading...</span>}
             onResolved={(users) => (
               <>
                 {users.map((user) => (
                   <div key={user.id}>
                     <User login={user.login} avatarUrl={user.avatar_url} />
                   </div>
                 ))}
               </>
             )}
           />
         </div>
       </div>
     );
   });
   ```