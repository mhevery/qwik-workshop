import { routeLoader$ } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const useIsFavorite = routeLoader$(async (requestEv) => {
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
    console.log("IS FAVORITE", favorite?.length, email, user, repo);
    return (favorite?.length || 0) > 0;
  }
  return false;
});
