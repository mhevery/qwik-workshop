import {
  component$,
  useComputed$,
  useSignal,
  useStylesScoped$,
} from "@builder.io/qwik";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";
import CSS from "./index.css?inline";

type OrgReposResponse =
  paths["/users/{username}/repos"]["get"]["responses"]["200"]["content"]["application/json"];

export const useRepositories = routeLoader$(async ({ params, env }) => {
  const response = await fetch(
    `https://api.github.com/users/${params.user}/repos?size=100`,
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

export default component$(() => {
  useStylesScoped$(CSS);
  const repositories = useRepositories();
  const location = useLocation();
  const filter = useSignal("");
  console.log("RENDER");
  const filteredRepos = useComputed$(() => {
    return repositories.value.filter(
      (repo) => repo.full_name.indexOf(filter.value) !== -1
    );
  });
  return (
    <div>
      <h2>Owner: {location.params.user}</h2>
      <input type="text" bind:value={filter} placeholder="filter" />
      <ul class="card-list">
        {filteredRepos.value.map((repo) => (
          <li key={repo.id} class="card-item">
            <code>
              <Link href={"/github/" + repo.full_name}>{repo.full_name}</Link>
            </code>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
});
