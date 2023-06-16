import {
  component$,
  useComputed$,
  useSignal,
  useStylesScoped$,
  $,
} from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";
import CSS from "./index.css?inline";
import { useMousePos, useMousePos$, useMousePosQrl } from "./mouse";

type OrgReposResponse =
  paths["/users/{username}/repos"]["get"]["responses"]["200"]["content"]["application/json"];

export const useRepositories = routeLoader$(async ({ params, env }) => {
  const response = await fetch(
    `https://api.github.com/users/${params.user}/repos?per_page=100`,
    {
      headers: {
        "User-Agent": "Qwik Workshop",
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
      },
    }
  );
  const value = (await response.json()) as OrgReposResponse;
  return value.map((repo) => ({
    full_name: repo.full_name,
    id: repo.id,
    description: repo.description,
  }));
});

export default component$(() => {
  useStylesScoped$(CSS);
  const repositories = useRepositories();
  const location = useLocation();
  const filter = useSignal("");
  const mousePos = useMousePos$((pos) => {
    console.log("mousePos", pos);
  });
  const filteredRepos = useComputed$(() => {
    console.log("filtering");
    return repositories.value.filter(
      (repo) =>
        repo.full_name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1
    );
  });
  return (
    <div>
      User: {location.params.user}
      <hr />
      {mousePos.value.x}, {mousePos.value.y}
      <br />
      <input type="text" placeholder="Search..." bind:value={filter} />
      {filteredRepos.value.length} of {repositories.value.length}
      <ul class="card-list">
        {filteredRepos.value.map((repo) => (
          <li key={repo.id} class="card-item">
            <a href={`/github/${repo.full_name}`}>{repo.full_name}</a>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
});
