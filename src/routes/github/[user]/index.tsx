import {
  component$,
  useSignal,
  useStore,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, routeLoader$, server$ } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";
import CSS from "./index.css?inline";

type OrgReposResponse =
  paths["/users/{username}/repos"]["get"]["responses"]["200"]["content"]["application/json"];

export const useGithubUser = routeLoader$(async ({ params, env }) => {
  const response = await fetch(
    `https://api.github.com/users/${params.user}/repos?per_page=100`,
    {
      headers: {
        "User-Agent": "Qwik Workshop",
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
      },
    },
  );
  const repos = (await response.json()) as OrgReposResponse;
  console.log(">>>>>", repos);
  return (
    Array.isArray(repos) &&
    repos.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
    }))
  );
});

export default component$(() => {
  useStylesScoped$(CSS);
  const githubUser = useGithubUser();
  const filter = useSignal("");
  return (
    <div>
      <input
        class="input input-bordered w-full max-w-xs"
        type="text"
        bind:value={filter}
      />{" "}
      {filter.value}
      <ul class="card-list">
        {githubUser.value
          .filter((repo) => repo.name.indexOf(filter.value) !== -1)
          .map((repo) => (
            <li key={repo.full_name} class="card-item">
              <Link href={`/github/${repo.full_name}`}>{repo.full_name}</Link>
            </li>
          ))}
      </ul>
      <AsyncDemo />
    </div>
  );
});

export const getData = server$(async function* () {
  for (let i = 0; i < 10; i++) {
    yield i;
    await delay(1000);
  }
});

async function delay(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export const AsyncDemo = component$(() => {
  const list = useStore<string[]>([]);
  useVisibleTask$(async () => {
    const abort = new AbortController();
    const dataStream = await getData(abort.signal);
    for await (const data of dataStream) {
      list.push(data.toString());
      if (data > 5) abort.abort();
    }
  });
  return (
    <div>
      <ul>
        {list.map((item, key) => (
          <li key={key}>{item}</li>
        ))}
      </ul>
    </div>
  );
});
