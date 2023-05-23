## Lesson 3: Repository details

**GitHub**: [Start](https://github.com/mhevery/qwik-workshop/tree/lesson-2) => [End](https://github.com/mhevery/qwik-workshop/tree/lesson-3) ([diff](https://github.com/mhevery/qwik-workshop/compare/lesson-2...lesson-3))

1. Create `src/routes/github/[user]/[repo]/index.tsx`:

   ```typescript
   import { component$ } from "@builder.io/qwik";
   import { useLocation, routeLoader$ } from "@builder.io/qwik-city";
   import type { paths } from "@octokit/openapi-types";

   type OrgRepoResponse =
     paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["content"]["application/json"];

   export const useRepository = routeLoader$(async ({ params, env }) => {
     const user = params.user;
     const repo = params.repo;

     const response = await fetch(
       `https://api.github.com/repos/${user}/${repo}`,
       {
         headers: {
           "User-Agent": "Qwik Workshop",
           "X-GitHub-Api-Version": "2022-11-28",
           Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
         },
       }
     );
     const repository = (await response.json()) as OrgRepoResponse;
     return repository;
   });

   export default component$(() => {
     const repository = useRepository();
     const location = useLocation();
     return (
       <div>
         <h1>
           Repository:{" "}
           <a href={"/github/" + location.params.user}>
             {location.params.user}
           </a>
           /{location.params.repo}
         </h1>
         <div>
           <b>Repo:</b> {repository.value.name}
         </div>
         <div>
           <b>Description:</b> {repository.value.description}
         </div>
       </div>
     );
   });
   ```

Review:

1. Created `src/routes/github/[user]/[repo]` route.
2. Used `routeLoader$()` to fetch data from GitHub API.
3. Used `useLocation()` to get the route parameters.
