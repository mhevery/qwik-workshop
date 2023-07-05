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

export default component$<{ query?: string }>(({ query }) => {
  const filter = useSignal(query || "");
  const debouncedFilter = useSignal(query || "");
  useTask$(({ track, cleanup }) => {
    const value = track(() => filter.value);
    const timeout = setTimeout(() => (debouncedFilter.value = value), 500);
    cleanup(() => clearTimeout(timeout));
  });
  const users = useResource$(async ({ track }) => {
    const query = track(() => debouncedFilter.value);
    if (query) {
      console.log("query", query);
      return await fetchUsers(query);
    }
    return [];
  });

  return (
    <div>
      <input type="text" bind:value={filter} placeholder="filter" />
      {debouncedFilter.value}
      <Resource
        value={users}
        onPending={() => <span>loading...</span>}
        onResolved={(users) => (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.login}</li>
            ))}
          </ul>
        )}
      />
    </div>
  );
});
