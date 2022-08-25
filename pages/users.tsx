import { motion } from 'framer-motion';
import absoluteUrl from 'next-absolute-url';
import Link from 'next/link';
import { FaSpotify } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import CenterStage from '../components/CenterStage';
import Container from '../components/Container';
import Section from '../components/Section';
import getAllUsers from '../fe_controller/song/getAllUsers';

type UsersProps = {
	users: any[];
};

export async function getServerSideProps(context: any) {
	const { origin } = absoluteUrl(context.req);
	console.log(origin);
	const users = await getAllUsers();

	return {
		props: {
			users,
		},
	};
}

const Users = ({ users }: UsersProps) => {
	return (
		<CenterStage>
			<Container>
				<Section>
					<header className="my-10">
						<h1>Musicn Users</h1>
						<p className="muted">All Musicn users</p>
					</header>
					<div className="grid md:grid-cols-2 gap-5">
						{users.map((user, index) => {
							return (
								<div
									key={index}
									className="border border-white/20 break-all p-5 rounded-xl"
								>
									<h2
										className={`text-2xl font-bold ${
											!user.spotify_users &&
											'text-white/20'
										}`}
									>
										{decodeURI(user.name)}
									</h2>
									<p
										className={`text-sm ${
											!user.spotify_users
												? 'text-white/20'
												: 'muted'
										}`}
									>
										@{user.username}
									</p>

									{user.spotify_users && (
										<div className="flex flex-wrap gap-2">
											{/* <p>
											Spotify name:{' '}
											{user.spotify_users.name}
										</p>
										<p>
											Spotify user id:{' '}
											{user.spotify_users.spotify_userid}
										</p> */}

											{/* Profile Button */}
											<motion.div
												className="w-fit"
												whileHover={{
													scale: 1.1,
												}}
												whileTap={{
													scale: 0.9,
												}}
											>
												<Link
													href={`/user/${user.username}`}
												>
													<a className="bg-white text-black font-bold shadow-[0px_0px_20px] shadow-white/20 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
														<IoPerson size={16} />
														Profile
													</a>
												</Link>
											</motion.div>

											<motion.div
												className="w-fit"
												whileHover={{
													scale: 1.1,
												}}
												whileTap={{
													scale: 0.9,
												}}
											>
												<Link
													href={`https://open.spotify.com/user/${user.spotify_users.spotify_userid}`}
												>
													<a className="bg-spotify font-bold shadow-[0px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
														<FaSpotify size={16} />
														Spotify
													</a>
												</Link>
											</motion.div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</Section>
			</Container>
		</CenterStage>
	);
};

export default Users;
