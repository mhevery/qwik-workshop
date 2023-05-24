import { component$ } from '@builder.io/qwik';

export const LoadingIcon = component$(() => {
	return (
		<div class='w-full flex flex-col  items-center'>
			<div
				class='inline-block h-24 w-24 animate-spin rounded-full border-8 border-solid border-slate-600 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
				role='status'
			/>
      <h1 class='text-slate-600 text-3xl mt-6 mb-2'>Loading...</h1>
		</div>
	);
});
