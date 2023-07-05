import GithubSearch from "../../routes/github";

import { component$ } from "@builder.io/qwik";

export default component$<{ query: string }>(({ query }) => {
  return <GithubSearch query={query} />;
});
