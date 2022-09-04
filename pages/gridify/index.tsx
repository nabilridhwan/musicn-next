import ButtonWithLoading from '@/components/ButtonWithLoading';
import CenterStage from '@/components/CenterStage';
import Section from '@/components/Section';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '../../components/Container';

type UsersProps = {
	user: any;
	top: any;
};

const GridifyLandingPage = () => {
	const router = useRouter();
	console.log(router.query);
	const [username, setUsername] = useState('');

	const [notFound, setNotFound] = useState(false);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const { notFound } = router.query;

		if (notFound === 'true') {
			setNotFound(true);
		}
	}, [router.query]);
	return (
		<>
			<Head>
				<title>Gridify - Show your Top songs</title>

				<meta
					name="description"
					content="Show your top songs as a grid!"
				></meta>
			</Head>
			<Container>
				<CenterStage>
					<Section>
						{/* Image wrapper */}
						<motion.div
							initial={{
								opacity: 0,
								boxShadow: '0 0 50px rgba(255,255,255,1)',
							}}
							animate={{ opacity: 1, boxShadow: '0 0 0 ' }}
							transition={{ duration: 2 }}
							className="image-wrapper rounded-lg border border-white/40"
						>
							{/* <picture className="rounded-lg h-60 w-auto">
								<img src={exampleImage} alt="Gridify Example" />
							</picture> */}
						</motion.div>
						<div className="flex flex-col items-center justify-center my-10">
							<Link href="/gridify">
								<a className="flex items-center gap-2 my-2">
									<div className="text-xs relative bg-red-500 rounded-lg p-1 font-bold">
										New (BETA)
									</div>
								</a>
							</Link>
							<h1>Gridify</h1>
							<p className="muted">
								See your top songs of the month as a grid! Save
								it and share it!
							</p>

							<p className="italic text-xs mt-5">
								*This is a BETA version, it does not work with
								iOS devices.
							</p>
						</div>

						<motion.div className="text-center text-white border border-white/30 rounded-lg px-4 py-2 w-fit text-xs m-auto my-10">
							Only works with Registered Musicn users! (Sign up{' '}
							<Link href="/signup">
								<a className="underline">here</a>
							</Link>
							)
						</motion.div>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								setLoading(true);
								window.location.href = `/gridify/${username}`;
							}}
						>
							{notFound && (
								<p className="error text-center">
									User not found or Spotify account not linked
								</p>
							)}
							<input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								type="text"
								placeholder="Enter a Musicn username"
								className="input text-center"
							/>

							<ButtonWithLoading
								disabled={loading}
								isLoading={loading}
								text="Gridify me!"
							/>
						</form>
					</Section>
				</CenterStage>
			</Container>
		</>
	);
};

export default GridifyLandingPage;
