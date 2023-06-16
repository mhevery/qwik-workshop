import {
  JSXNode,
  Resource,
  component$,
  useResource$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";
import type { paths } from "@octokit/openapi-types";
import { DisplayReact, HelloReact } from "./index.react";

type SearchUsersResponse =
  paths["/search/users"]["get"]["responses"]["200"]["content"]["application/json"];

export const useFavorites = routeLoader$(async (requestEv) => {
  const email = requestEv.sharedMap.get("session")?.user?.email as
    | string
    | undefined;
  if (email) {
    const supabaseClient = createServerClient(
      requestEv.env.get("PRIVATE_SUPABASE_URL")!,
      requestEv.env.get("PRIVATE_SUPABASE_ANON_KEY")!,
      requestEv
    );
    const { data: favorites, error } = await supabaseClient
      .from("favorite")
      .select("*")
      .eq("email", email);
    if (error) {
      console.log("ERROR", error);
      throw error;
    }
    return favorites as { email: string; repo: string; user: string }[];
  }
  return [];
});

export default component$(() => {
  const count = useSignal(0);
  useVisibleTask$(() => {
    setTimeout(() => (count.value = 1), 1000);
  });
  return (
    <div>
      <Favorites />
      <Search />
      <HelloReact onIncrement$={() => count.value++} />
      <DisplayReact count={count.value} />
    </div>
  );
});

export const Favorites = component$(() => {
  const favorites = useFavorites();
  return (
    <div>
      <h1>Favorites</h1>
      <ul>
        {favorites.value.map((favorite, idx) => (
          <li key={idx}>
            <a href={`/github/${favorite.user}/${favorite.repo}`}>
              {favorite.user}/{favorite.repo}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export const Search = component$(() => {
  const query = useSignal("");
  const debounceQuery = useSignal("");
  useTask$(async ({ track, cleanup }) => {
    const value = track(() => query.value);
    const timeout = setTimeout(() => (debounceQuery.value = value), 500);
    cleanup(() => clearTimeout(timeout));
  });
  const users = useResource$(async ({ track }) => {
    console.log("runQuery", debounceQuery.value);
    const query = track(() => debounceQuery.value);
    if (query) {
      return runQuery(debounceQuery.value);
    }
    return [];
  });
  return (
    <div>
      <h1>Search Github Username</h1>
      <input
        type="text"
        placeholder="Search..."
        // bind:value={query}
        value={query.value}
        onInput$={(e, t) => (query.value = t.value)}
      />{" "}
      {debounceQuery.value}
      <Resource
        value={users}
        onPending={() => <div>Loading...</div>}
        onResolved={(users) => (
          <ul>
            {users.map((user, idx) => (
              <li key={idx}>
                <a href={`/github/${user.login}`}>{user.login}</a>
              </li>
            ))}
          </ul>
        )}
      />
    </div>
  );
});

const runQuery = server$(async function (query: string) {
  console.log("Run query", query);
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
  return users.items.map((item) => ({ login: item.login }));
});
