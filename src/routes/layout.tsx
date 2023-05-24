import { component$, Slot, useStylesScoped$ } from '@builder.io/qwik';
import { useAuthSession, useAuthSignout, useAuthSignin } from './plugin@auth';
import { Form, useLocation } from '@builder.io/qwik-city';
import CSS from './layout.css?inline';

export default component$(() => {
	useStylesScoped$(CSS);
	const session = useAuthSession();
	const authSignin = useAuthSignin();
	const authSignout = useAuthSignout();
	const location = useLocation();
	const user = session.value?.user;
	return (
		<>
			<header
				class='flex items-center bg-slate-600 py-4'
				style='justify-content: space-between'
			>
				<h2 class='text-white font-bold text-2xl pl-4'>Qwik Workshop</h2>
				<div class='flex items-center'>
					{user ? (
						<Form action={authSignout}>
							<div class='flex items-center'>
								{user.image && (
									<img src={user.image} class='mr-2' width={60} height={60} />
								)}
								<div class='text-white mr-4'>
									{user.name}({user.email})
								</div>
								<button class='bg-cyan-500 text-white p-2 rounded mr-4 hover:bg-cyan-400'>
									Sign Out
								</button>
							</div>
						</Form>
					) : (
						<Form action={authSignin}>
							<input type='hidden' name='providerId' value='github' />
							<input
								type='hidden'
								name='options.callbackUrl'
								value={location.url.toString()}
							/>
							<button class='bg-cyan-500 text-white p-2 rounded mr-4 hover:bg-cyan-400'>
								Sign in
							</button>
						</Form>
					)}
				</div>
			</header>
			<Slot />
		</>
	);
});
