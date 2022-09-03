import CenterStage from '@/components/CenterStage';
import Container from '@/components/Container';
import Section from '@/components/Section';
import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { IoArrowForward } from 'react-icons/io5';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>
					Musicn - Discover what other people are listening to
				</title>
			</Head>
			<Container>
				<CenterStage>
					<Section>
						<div className="text-center">
							<h1 className="leading-tight">
								Discover what other people are listening to
							</h1>

							<p className="muted my-5">
								With Musicn, you can discover what other people
								are listening to, and create your own Musicn
								profile.
							</p>

							<motion.div
								whileTap={{ scale: 0.9 }}
								whileHover={{ scale: 1.05 }}
							>
								<Link href={'/signup'}>
									<button
										data-test-id="get-started-button"
										className=" bg-white text-black font-bold shadow-[0px_0px_20px] shadow-white/20 rounded-lg px-4 py-2 w-full flex items-center justify-center gap-2 mt-10"
									>
										Get started
										{/* Arrow */}
										<motion.div
											initial={{ x: 0 }}
											animate={{
												x: 10,
												transition: {
													ease: 'easeInOut',
													duration: 0.8,
													repeat: Infinity,
													repeatType: 'reverse',
												},
											}}
										>
											<IoArrowForward size={16} />
										</motion.div>
									</button>
								</Link>
							</motion.div>

							<p className="mt-5 text-xs muted">
								<strong className="text-white/70">NEW</strong>{' '}
								See other people&apos;s recently played songs!
								Read more{' '}
								<Link href={'/changelog/v0-5-0'}>
									<a className="underline">here</a>
								</Link>
								.
							</p>
						</div>

						<div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
							<motion.div
								whileTap={{ scale: 0.9 }}
								whileHover={{ scale: 1.05 }}
							>
								<Link href={'/changelog'}>
									<button
										data-test-id="changelog-button"
										className="text-white border border-white/30 rounded-lg px-4 py-2 w-fit text-xs"
									>
										What&apos;s new? ✨
									</button>
								</Link>
							</motion.div>

							<motion.div
								whileTap={{ scale: 0.9 }}
								whileHover={{ scale: 1.05 }}
							>
								<Link href={'/blog/introducing-the-new-musicn'}>
									<button className="text-white border border-white/30 rounded-lg px-4 py-2 w-fit text-xs">
										Read: Some words from me
									</button>
								</Link>
							</motion.div>
						</div>
					</Section>
				</CenterStage>
			</Container>
		</>
	);
};

export default Home;
