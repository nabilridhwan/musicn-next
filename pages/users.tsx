import CenterStage from '@/components/CenterStage';
import Container from '@/components/Container';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import Section from '@/components/Section';
import getAllUsers from '@/frontend-api/user/getAllUsers';
import { motion } from 'framer-motion';
import absoluteUrl from 'next-absolute-url';
import Link from 'next/link';
import { FaSpotify } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';

type UsersProps = {
	users: any[];
};

export async function getServerSideProps(context: any) {
	const { origin } = absoluteUrl(context.req);
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
					{/* Page header */}
					<header className="my-10">
						<h1>Musicn Users</h1>
						<p className="muted">All Musicn users</p>

						<p className="muted text-xs mt-20 block">
							If your profile does not show up. Link your Spotify
							account in your profile page.
						</p>
					</header>

					<div
						data-test-id="users-list"
						className="grid md:grid-cols-2 gap-5"
					>
						{users.map((user, index) => {
							return (
								<div
									key={index}
									className="border border-white/20 break-all p-5 rounded-xl flex flex-col items-center text-center lg:text-left lg:flex-row gap-5 "
								>
									{/* Profile Picture */}
									{user.spotify_users && (
										<div className="col-span-1">
											{user.spotify_users
												.profile_pic_url ? (
												<picture>
													<img
														className="w-20 h-20 lg:w-28 lg:h-28 rounded-full aspect-square"
														src={
															user.spotify_users
																.profile_pic_url
														}
														alt={user.name}
													/>
												</picture>
											) : (
												<DefaultProfilePicture />
											)}
										</div>
									)}

									{/* Content */}
									<div className="col-span-3">
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
											<div className="flex flex-wrap gap-2 items-center justify-center">
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
														<a className="bg-white text-black shadow-[0px_0px_20px] shadow-white/20 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
															<IoPerson
																size={16}
															/>
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
														href={`https://open.spotify.com/user/${user.spotify_users.spotify_userid}?go=1`}
													>
														<a className="bg-spotify shadow-[0px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
															<FaSpotify
																size={16}
															/>
															Spotify
														</a>
													</Link>
												</motion.div>
											</div>
										)}
									</div>
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
