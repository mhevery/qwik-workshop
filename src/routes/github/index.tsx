import {
  Resource,
  component$,
  useResource$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";

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
      <h1>Github Search</h1>
      <input type="text" bind:value={filter} />
      <ul>
        <Resource
          value={users}
          onPending={() => <>loading...</>}
          onResolved={(users) => (
            <>
              {users.map((user) => (
                <ul key={user.id}>
                  <a href={`/github/${user.login}/`}>{user.login}</a>
                </ul>
              ))}
            </>
          )}
        />
      </ul>
    </div>
  );
});
