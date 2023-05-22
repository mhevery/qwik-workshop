import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { Octokit } from "octokit";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const useRepository = routeLoader$(async ({ params }) => {
  const org = params.org;
  const repo = params.repo;

  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_ACCESS_TOKEN,
  });

  const repository = await octokit.request("GET /repos/{owner}/{repo}", {
    owner: org,
    repo,
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });

  return repository;
});

export const useIsFavorite = routeLoader$(async (requestEv) => {
  const email = requestEv.sharedMap.get("session")?.user?.email as
    | string
    | undefined;
  const org = requestEv.params.org;
  const repo = requestEv.params.repo;
  if (email) {
    const supabaseClient = createServerClient(
      requestEv.env.get("PUBLIC_SUPABASE_URL")!,
      requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
      requestEv
    );
    const { data: favorite, error } = await supabaseClient
      .from("favorite")
      .select("*")
      .eq("email", email)
      .eq("org", org)
      .eq("repo", repo);
    if (error) {
      console.log("ERROR", error);
      throw error;
    }
    console.log("IS FAVORITE", favorite?.length, email, org, repo);
    return (favorite?.length || 0) > 0;
  }
  return false;
});

export const useSetFavoriteAction = routeAction$(
  async ({ favorite }, requestEv) => {
    const email = requestEv.sharedMap.get("session")?.user?.email as
      | string
      | undefined;
    const org = requestEv.params.org;
    const repo = requestEv.params.repo;
    console.log("SET FAVORITE", favorite, email, org, repo);
    const supabaseClient = createServerClient(
      requestEv.env.get("PUBLIC_SUPABASE_URL")!,
      requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
      requestEv
    );
    if (email) {
      await supabaseClient
        .from("favorite")
        .delete()
        .eq("email", email)
        .eq("org", org)
        .eq("repo", repo);
    }
    if (favorite && email) {
      await supabaseClient.from("favorite").upsert({
        email,
        org,
        repo,
      });
    }
  },
  zod$({ favorite: z.coerce.boolean() })
);

export default component$(() => {
  const repository = useRepository();
  const isFavorite = useIsFavorite();
  const setFavoriteAction = useSetFavoriteAction();
  return (
    <div>
      <div>
        <b>Repo:</b> {repository.value.data.name}
        <Form action={setFavoriteAction}>
          <input
            type="hidden"
            name="favorite"
            value={isFavorite.value ? "" : "true"}
          />
          <button style={{ color: isFavorite.value ? "red" : "gray" }}>
            {isFavorite.value ? "★" : "☆"}
          </button>
        </Form>
      </div>
      <div>
        <b>Description:</b> {repository.value.data.description}
      </div>
    </div>
  );
});
