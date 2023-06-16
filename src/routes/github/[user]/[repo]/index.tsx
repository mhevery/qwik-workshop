import { component$ } from "@builder.io/qwik";
import {
  useLocation,
  routeLoader$,
  Link,
  routeAction$,
  Form,
  zod$,
  z,
} from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";
import { useIsFavorite } from "./favorite";
import { createServerClient } from "supabase-auth-helpers-qwik";
export { useIsFavorite };

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
  return { description: repository.description };
});

export const useSetIsFavoriteAction = routeAction$(
  async ({ isFavorite }, requestEv) => {
    console.log("SET FAVORITE", isFavorite);
    const email = requestEv.sharedMap.get("session")?.user?.email as
      | string
      | undefined;
    const user = requestEv.params.user;
    const repo = requestEv.params.repo;
    if (email) {
      const supabaseClient = createServerClient(
        requestEv.env.get("PRIVATE_SUPABASE_URL")!,
        requestEv.env.get("PRIVATE_SUPABASE_ANON_KEY")!,
        requestEv
      );
      if (isFavorite) {
        await supabaseClient.from("favorite").upsert({
          email,
          user,
          repo,
        });
      } else {
        await supabaseClient
          .from("favorite")
          .delete()
          .eq("email", email)
          .eq("user", user)
          .eq("repo", repo);
      }
    }
  },
  zod$({
    isFavorite: z.coerce.boolean(),
  })
);

export default component$(() => {
  const location = useLocation();
  const repository = useRepository();
  const isFavorite = useIsFavorite();
  const setIsFavoriteAction = useSetIsFavoriteAction();
  return (
    <div>
      <h1>
        Repo:{" "}
        <Link href={`/github/${location.params.user}`}>
          {location.params.user}
        </Link>
        /{location.params.repo}
      </h1>
      <Form action={setIsFavoriteAction}>
        {setIsFavoriteAction.isRunning && <div>SAVING...</div>}
        <input
          type="hidden"
          name="isFavorite"
          value={isFavorite.value ? "" : "true"}
        />
        <button style={{ color: isFavorite.value ? "red" : "gray" }}>
          {isFavorite.value ? "★" : "☆"}
        </button>
      </Form>
      <p>{repository.value.description}</p>
    </div>
  );
});
