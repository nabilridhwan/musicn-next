import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import Link from 'next/link';
import { IoArrowForward } from 'react-icons/io5';
import CenterStage from '../components/CenterStage';
import Container from '../components/Container';
import Section from '../components/Section';

const Home: NextPage = () => {
	return (
		<Container>
			<CenterStage>
				<Section>
					<div className="text-center">
						<h1 className="leading-tight">
							Discover what other people are listening to
						</h1>

						<p className="muted my-5">
							With Musicn, you can discover what other people are
							listening to, and create your own Musicn profile.
						</p>

						<Link href={'/users'}>
							<button className=" bg-white text-black font-bold shadow-[0px_0px_20px] shadow-white/20 rounded-lg px-4 py-2 w-full flex items-center justify-center gap-2 mt-10">
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
					</div>
				</Section>
			</CenterStage>
		</Container>
	);
};

export default Home;
