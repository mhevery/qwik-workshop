
import ImgMhevery from '~/media/mhevery.jpeg?jsx';import {
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
    },
  );
  const users = (await response.json()) as SearchUsersResponse;
  console.log(users.items);
  return users.items;
});

export default component$(() => {
  const filter = useSignal("");
  const debounceFilter = useSignal("");
  useTask$(({ track }) => {
    track(() => filter.value);
    const timeout = setTimeout(() => {
      debounceFilter.value = filter.value;
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  });
  const users = useResource$(({ track }) => {
    const value = track(() => debounceFilter.value);
    if (value) {
      return fetchUsers(value);
    }
    return [];
  });
  return (
    <div>
      <ImgMhevery />
      <div>
        <input type="text" bind:value={filter} />
      </div>
      <Resource
        value={users}
        onPending={() => <>loading...</>}
        onResolved={(users) => (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.login}</li>
            ))}
          </ul>
        )}
        onRejected={(error) => <div>ERROR: {error.message}</div>}
      />
    </div>
  );
});
