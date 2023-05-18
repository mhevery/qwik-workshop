import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Octokit } from "octokit";

export const useRepositories = routeLoader$(async ({ params }) => {
  console.log("params", params);
  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_ACCESS_TOKEN,
  });

  const repository = await octokit.request("GET /orgs/{org}/repos", {
    org: params.org,
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });
  console.log(repository.data[0]);

  return repository;
});

export default component$(() => {
  const repositories = useRepositories();
  return (
    <div>
      <ul>
        {repositories.value.data!.map((repo) => (
          <li key={repo.id}>
            <a href={`/${repo.full_name}`}>{repo.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});
