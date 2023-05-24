import {
  component$,
  useComputed$,
  useSignal,
  useStylesScoped$,
} from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";
import CSS from "./index.css?inline";

export type OrgReposResponse =
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

export default component$(() => {
  useStylesScoped$(CSS);
  const filter = useSignal("");
  const repositories = useRepositories();
  const filteredRepos = useComputed$(() =>
    repositories.value.filter((repo) =>
      repo.full_name.toLowerCase().includes(filter.value.toLowerCase())
    )
  );
  const location = useLocation();
  return (
    <div>
      <h1>Repositories for {location.params.user}</h1>
      <input type="text" bind:value={filter} />
      <ul class="card-list">
        {filteredRepos.value.map((repo) => (
          <li key={repo.full_name} class="card-item">
            <a href={`/github/${repo.full_name}`}>{repo.full_name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});
