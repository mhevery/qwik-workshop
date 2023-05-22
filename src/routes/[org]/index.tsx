import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";

type OrgReposResponse =
  paths["/users/{username}/repos"]["get"]["responses"]["200"]["content"]["application/json"];

export const useRepositories = routeLoader$(async ({ params }) => {
  const response = await fetch(
    `https://api.github.com/users/${params.org}/repos`,
    {
      headers: {
        "User-Agent": "Qwik Workshop",
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: "Bearer " + import.meta.env.VITE_GITHUB_ACCESS_TOKEN,
      },
    }
  );
  const text = await response.text();
  try {
    const repository = JSON.parse(text) as OrgReposResponse;
    return repository;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw e;
  }
});

export default component$(() => {
  const repositories = useRepositories();
  return (
    <div>
      <ul>
        {repositories.value.map((repo) => (
          <li key={repo.id}>
            <a href={`/${repo.full_name}`}>{repo.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});
