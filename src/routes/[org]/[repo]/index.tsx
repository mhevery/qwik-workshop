import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Octokit } from "octokit";

export const useRepository = routeLoader$(async () => {
  const owner = "BuilderIO";
  const repo = "qwik";

  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_ACCESS_TOKEN,
  });

  const repository = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo,
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });

  return repository;
});

export default component$(() => {
  const repository = useRepository();
  return (
    <div>
      <div>
        <b>Repo:</b> {repository.value.data.name}
      </div>
      <div>
        <b>Description:</b> {repository.value.data.description}
      </div>
    </div>
  );
});
