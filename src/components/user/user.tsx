import { component$ } from '@builder.io/qwik';

type Props = {
	avatarUrl: string;
	login: string;
};

export const User = component$<Props>(({ login, avatarUrl }) => {
	return (
		<div class='flex container mx-auto p-4 mb-4 bg-slate-600 w-[350px] rounded-2xl overflow-hidden'>
			<img
				class='rounded-xl min-w-[150px] max-w-[150px]'
				height='150'
				width='150'
				src={avatarUrl}
				alt={login}
			/>
			<div class='w-full flex flex-col justify-between items-center p-4'>
				<div class='mt-5 text-white text-md font-semibold text-ellipsis overflow-hidden'>
					{login}
				</div>
				<a
					class='flex items-center text-white text-md font-semibold bg-cyan-500 py-2 px-4 rounded-lg hover:bg-cyan-400'
					href={`/github/${login}/`}
				>
					Detail
				</a>
			</div>
		</div>
	);
});
