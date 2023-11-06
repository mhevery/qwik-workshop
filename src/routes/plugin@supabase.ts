import { type RequestHandler } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const onRequest: RequestHandler = async (requestEv) => {
  const supabaseClient = createServerClient(
    requestEv.env.get("PRIVATE_SUPABASE_URL")!,
    requestEv.env.get("PRIVATE_SUPABASE_ANON_KEY")!,
    requestEv,
  );
  requestEv.sharedMap.set("supabase", supabaseClient);
};
