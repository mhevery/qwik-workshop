import {
	Resource,
	component$,
	useResource$,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { server$ } from '@builder.io/qwik-city';
import type { SearchUsersResponse } from '../github';
import { SearchIcon } from '~/components/icons/SearchIcon';
import { LoadingIcon } from '~/components/icons/LoadingIcon';
import { User } from '~/components/user/User';

const fetchUsers = server$(async function (query: string) {
	const response = await fetch(
		'https://api.github.com/search/users?q=' + query,
		{
			headers: {
				'User-Agent': 'Qwik Workshop',
				'X-GitHub-Api-Version': '2022-11-28',
				Authorization: 'Bearer ' + this.env.get('PRIVATE_GITHUB_ACCESS_TOKEN'),
			},
		}
	);
	const users = (await response.json()) as SearchUsersResponse;
	return users.items;
});

export default component$(() => {
	const filter = useSignal('');
	const debouncedFilter = useSignal('');
	useTask$(({ track, cleanup }) => {
		track(filter);
		const id = setTimeout(() => (debouncedFilter.value = filter.value), 400);
		cleanup(() => clearTimeout(id));
	});
	const users = useResource$(async ({ track }) => {
		track(debouncedFilter);
		return debouncedFilter.value ? await fetchUsers(debouncedFilter.value) : [];
	});
	return (
		<div>
			<div class='flex flex-col justify-center text-center'>
				<h1 class='text-slate-600 text-3xl mt-6 mb-2'>GitHub search</h1>
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
			<div class='flex flex-wrap p-8' style='justify-content: space-between'>
				<Resource
					value={users}
					onPending={() => <LoadingIcon />}
					onResolved={(users) => (
						<>
							{users.map((user) => (
								<div key={user.id}>
									<User user={user} />
								</div>
							))}
						</>
					)}
				/>
			</div>
		</div>
	);
});
