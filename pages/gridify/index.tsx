import CenterStage from '@/components/CenterStage';
import Section from '@/components/Section';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
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
							<Image
								className="rounded-lg"
								layout="responsive"
								src={require('@/public/gridify-example.png')}
								alt="Gridify Example"
							/>
						</motion.div>
						<div className="flex flex-col items-center justify-center my-10">
							<h1>Gridify</h1>
							<p className="muted">
								Save your top songs as a grid!
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

							<button className="btn btn-primary m-auto">
								Gridify Me!
							</button>
						</form>
					</Section>
				</CenterStage>
			</Container>
		</>
	);
};

export default GridifyLandingPage;
