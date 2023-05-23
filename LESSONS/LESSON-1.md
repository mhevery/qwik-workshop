## Lesson 1: Create route: `/github/[user]/`

**GitHub**: [Start](https://github.com/mhevery/qwik-workshop/tree/lesson-0) => [End](https://github.com/mhevery/qwik-workshop/tree/lesson-1) ([diff](https://github.com/mhevery/qwik-workshop/compare/lesson-0...lesson-1))

1. Create `src/routes/github/[user]/index.tsx`
   ```typescript
   import { component$ } from "@builder.io/qwik";
   export default component$(() => {
     return <div>Hello</div>;
   });
   ```
2. Test it out on http://localhost:5173/github/BuilderIO/
3. `npm install @octokit/openapi-types --save-dev`
4. Add `routeLoader()` to fetch data from Github

   ```typescript
   import { routeLoader$ } from "@builder.io/qwik-city";
   import type { paths } from "@octokit/openapi-types";

   type OrgReposResponse =
     paths["/users/{username}/repos"]["get"]["responses"]["200"]["content"]["application/json"];

   export const useRepositories = routeLoader$(async ({ params, env }) => {
     const response = await fetch(
       `https://api.github.com/users/${params.user}/repos`,
       {
         headers: {
           "User-Agent": "Qwik Workshop",
           "X-GitHub-Api-Version": "2022-11-28",
           Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
         },
       }
     );
     return (await response.json()) as OrgReposResponse;
   });
   ```

5. Add `useRepositories()` to the component and render all of the repositories
   ```typescript
   <ul>
     {repositories.value.map((repo) => (
       <li key={repo.full_name}>
         <a href={`/github/${repo.full_name}`}>{repo.full_name}</a>
       </li>
     ))}
   </ul>
   ```
6. Add styling as needed

   ```typescript
   import CSS from "./index.css?inline";

   export default component$(() => {
     useStylesScoped$(CSS);
     ...
   });
   ```

   create file: `index.css`:

   ```css
   .card-list {
     display: grid;
     grid-template-columns: repeat(4, 1fr);
     grid-gap: 20px;
     list-style: none;
     padding: 0;
     margin: 1em;
   }

   .card-item {
     background-color: #f2f2f2;
     border-radius: 8px;
     padding: 20px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     min-height: 4em;
   }
   ```

Review:

1. Declared a `/github/[user]/` route by placing a file in `src/routes/github/[user]/index.tsx`
2. Used `routeLoader$()` to fetch data from GitHub API.
3. Styled the component by adding `src/routes/github/[user]/index.css` and importing it into the component using `index.css?inline` syntax and `useStylesScoped$()` hook.
4. Used `.env`/`.env.local` file to store the GitHub access token in secure way.
