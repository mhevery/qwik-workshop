import { component$, useSignal } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";

import type { paths } from "@octokit/openapi-types";
import { createServerClient } from "supabase-auth-helpers-qwik";

type OrgRepoResponse =
  paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["content"]["application/json"];

export const useRepository = routeLoader$(async ({ params, env }) => {
  const user = params.user;
  const repo = params.repo;

  const response = await fetch(`https://api.github.com/repos/${user}/${repo}`, {
    headers: {
      "User-Agent": "Qwik Workshop",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
    },
  });
  const repository = (await response.json()) as OrgRepoResponse;
  return repository;
});

export const useIsFavorite = routeLoader$(async (requestEv) => {
  const email = requestEv.sharedMap.get("session")?.user?.email as
    | string
    | undefined;
  const user = requestEv.params.user;
  const repo = requestEv.params.repo;
  if (email) {
    const supabaseClient = requestEv.sharedMap.get("supabase");
    const { data: favorite, error } = await supabaseClient
      .from("favorite")
      .select("*")
      .eq("email", email)
      .eq("user", user)
      .eq("repo", repo);
    if (error) {
      console.log("ERROR", error);
      throw error;
    }
    // console.log("IS FAVORITE", favorite?.length, email, user, repo);
    return (favorite?.length || 0) > 0;
  }
  return false;
});

export const useSetIsFavorite = routeAction$(
  async (params, requestEv) => {
    const email = requestEv.sharedMap.get("session")?.user?.email as
      | string
      | undefined;
    const user = requestEv.params.user;
    const repo = requestEv.params.repo;
    console.log("Set isFavorite", params, email, user, repo);
    const supabaseClient = requestEv.sharedMap.get("supabase");
    if (email) {
      await supabaseClient
        .from("favorite")
        .delete()
        .eq("email", email)
        .eq("user", user)
        .eq("repo", repo);
    }
    if (params.setFavorite && email) {
      await supabaseClient.from("favorite").upsert({
        email,
        user,
        repo,
      });
    }
  },
  zod$({
    setFavorite: z.coerce.boolean(),
  }),
);

export default component$(() => {
  const repository = useRepository();
  const location = useLocation();
  const isFavorite = useIsFavorite();
  const setIsFavorite = useSetIsFavorite();
  return (
    <div class="card bg-base-100 w-96 shadow-xl">
      <h1>
        Repository:{" "}
        <a href={"/github/" + location.params.user}>{location.params.user}</a>/
        {location.params.repo}
      </h1>
      <Form action={setIsFavorite}>
        <input
          type="hidden"
          name="setFavorite"
          value={isFavorite.value ? "" : "true"}
        />
        <button>{isFavorite.value ? "★" : "☆"}</button>
      </Form>
      <div class="">
        <b>Repo:</b> {repository.value.name}
      </div>
      <div>
        <b>Description:</b> {repository.value.description}
      </div>
    </div>
  );
});
