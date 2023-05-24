import { component$, useComputed$, useSignal } from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import { SearchIcon } from '~/components/icons/SearchIcon';
import { Repo } from '~/components/repo/Repo';
import type { OrgReposResponse } from '~/routes/github/[user]';

export const useRepositories = routeLoader$(async ({ params, env }) => {
	const response = await fetch(
		`https://api.github.com/users/${params.user}/repos`,
		{
			headers: {
				'User-Agent': 'Qwik Workshop',
				'X-GitHub-Api-Version': '2022-11-28',
				Authorization: 'Bearer ' + env.get('PRIVATE_GITHUB_ACCESS_TOKEN'),
			},
		}
	);
	return (await response.json()) as OrgReposResponse;
});

export default component$(() => {
	const filter = useSignal('');
	const repositories = useRepositories();
	const filteredRepos = useComputed$(() =>
		repositories.value.filter((repo) =>
			repo.full_name.toLowerCase().includes(filter.value.toLowerCase())
		)
	);
	const location = useLocation();
	return (
		<div>
			<div class='flex flex-col justify-center text-center'>
				<h1 class='text-slate-600 text-3xl mt-6 mb-2'>
					{location.params.user}
				</h1>
				<div class='flex items-center border p-2 rounded-md text-white bg-slate-600 w-[600px] mx-auto'>
					<div class='w-9'>
						<SearchIcon />
					</div>
					<input
						type='text'
						placeholder='Search...'
						bind:value={filter}
						class='w-full text-xl bg-slate-600 outline-none pl-4'
					/>
				</div>
			</div>
			<div class='flex flex-col p-8'>
				{filteredRepos.value.map((repo) => (
					<div key={repo.id}>
						<Repo repo={repo}>
							<div q:slot='title'>
								<a class="underline" href={`/design-github/${repo.full_name}`}>{repo.full_name}</a>
							</div>
						</Repo>
					</div>
				))}
			</div>
		</div>
	);
});
