import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_ACCESS_TOKEN,
});
const prisma = new PrismaClient();

export const useRepository = routeLoader$(async ({ params }) => {
  const owner = params.org;
  const repo = params.repo;

  const repository = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo,
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });

  return repository;
});

export const useIsFavorite = routeLoader$(async ({ params, sharedMap }) => {
  const email = sharedMap.get("session")?.user?.email as string | undefined;
  const org = params.org;
  const repo = params.repo;
  if (email) {
    const users = await prisma.favorite.findMany({
      where: { org, repo, email },
    });
    console.log("IS FAVORITE", users.length > 0);
    return users.length > 0;
  }
  return false;
});

export const useSetFavoriteAction = routeAction$(
  async ({ favorite }, { params, sharedMap }) => {
    const email = sharedMap.get("session")?.user?.email as string | undefined;
    const org = params.org;
    const repo = params.repo;
    console.log("SET FAVORITE", favorite, email, org, repo);
    if (email) {
      await prisma.favorite.deleteMany({
        where: { org, repo, email },
      });
    }
    if (favorite && email) {
      await prisma.favorite.create({
        data: { org, repo, email },
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
