import { Slot, component$ } from '@builder.io/qwik';
import type { OrgReposResponse } from '~/routes/github/[user]';
import { ForkIcon } from '../icons/ForkIcon';
import { StarIcon } from '../icons/StarIcon';
import { RepoIcon } from '../icons/RepoIcon';
import type { OrgRepoResponse } from '~/routes/design-github/[user]/[repo]';

type Props = {
	repo: OrgReposResponse[0] | OrgRepoResponse;
};

export const Repo = component$<Props>(({ repo }) => {
	return (
		<div class='flex flex-col container mx-auto p-6 mb-4 bg-slate-600 text-white w-[600px] rounded-2xl overflow-hidden'>
			<div class='flex items-center'>
				<RepoIcon />
				<div class='font-bold text-lg text-ellipsis overflow-hidden pl-2'>
					<Slot name='title' />
				</div>
				<Slot />
			</div>
			<div class='text-sm pt-3'>Description:</div>
			<div class='text-md pt-1'>{repo.description || '--'}</div>
			<div class='pt-5 text-xs flex'>
				<div class='flex items-center mr-4'>
					<StarIcon />
					<span>{repo.stargazers_count}</span>
				</div>
				<div class='flex items-center'>
					<ForkIcon />
					<span>{repo.forks}</span>
				</div>
			</div>
		</div>
	);
});
