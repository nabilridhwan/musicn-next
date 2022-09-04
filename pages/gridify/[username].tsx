import CenterStage from '@/components/CenterStage';
import LoadingSpinner from '@/components/LoadingSpinner';
import Section from '@/components/Section';
import getTopSongs from '@/frontend-api/song/getTopSongs';
import getUserDetails from '@/frontend-api/user/getUserDetails';
import axios from 'axios';
import chroma from 'chroma-js';
import domtoimage from 'dom-to-image';
import getColors from 'get-image-colors';
import { DateTime } from 'luxon';
import Head from 'next/head';
import { Ref, useRef, useState } from 'react';
import { IoDownloadOutline } from 'react-icons/io5';
import Container from '../../components/Container';

type UsersProps = {
	user: any;
	top: any;
	played: any;
};

export async function getServerSideProps(context: any) {
	const { username } = context.query;

	try {
		let [user, top, played] = await axios.all([
			getUserDetails(username),
			getTopSongs(username),
			// getStatisticsPlayed(username),
		]);

		if (!user) {
			throw new Error('User not found');
		}

		if (!user.spotify_users) {
			throw new Error('No spotify user found');
		}

		if (user.preferences.account === false) {
			throw new Error('Account is not visible to the public');
		}

		if (user.preferences.top === false) {
			top = [];
		}

		if (top.length > 0) {
			const topPromises = top.map(async (song: any) => {
				const colors = await getColors(song.album_art);

				const image = await axios
					.get(song.album_art, {
						responseType: 'arraybuffer',
					})
					.then((response) =>
						Buffer.from(response.data, 'binary').toString('base64')
					);

				return {
					...song,
					album_art_base64: image,
					color: colors[2].alpha(0.6).hex() || null,
				};
			});

			const values = await Promise.all(topPromises);
			top = values;
		}

		return {
			props: {
				user: user,
				top,
				// played,
			},
		};
	} catch (error: any) {
		if (error.message === 'User not found') {
			return {
				redirect: {
					destination: '/gridify?notFound=true',
					permanent: false,
				},
			};
		}

		if (error.message === 'No spotify user found') {
			return {
				redirect: {
					destination: '/gridify?noSpotify=true',
					permanent: false,
				},
			};
		}

		return {
			redirect: {
				destination: '/gridify?notFound=true',
				permanent: false,
			},
		};
	}
}

const GridifyHome = ({ user, top, played }: UsersProps) => {
	const saveItemRef = useRef(null);

	const [showCanvas, setShowCanvas] = useState(false);

	const handleDownloadImage = async () => {
		setShowCanvas(true);

		// setTimeout(async () => {
		const element = saveItemRef.current;
		// 	// if (!element) return;

		if (element) {
			domtoimage
				.toJpeg(element, {
					width: 1080,
					height: 1920,
				})
				.then(function (dataUrl) {
					var link = document.createElement('a');
					link.download = 'my-image-name.jpeg';
					link.href = dataUrl;
					link.click();
				})
				.catch((e) => console.log(e));
		}
		// 	// const canvas = await html2canvas(element!, {
		// 	// 	useCORS: true,
		// 	// });

		// 	// const data = canvas.toDataURL('image/png', 1);
		// 	// const link = document.createElement('a');

		// 	// link.href = data;
		// 	// link.download = `gridify-${user.username}.png`;
		// 	// link.click();

		// }, 500);
		setShowCanvas(false);
	};

	return (
		<>
			<Head>
				<title>Gridify</title>

				<meta
					name="description"
					content="Show your top songs as a grid!"
				></meta>
			</Head>

			<div className="overflow-hidden">
				<Container>
					<CenterStage>
						<Section>
							<div className="text-center flex flex-col items-center justify-center my-10">
								<h1>Your Gridify is ready!</h1>
								<p className="muted">
									Hi {user.name}! Click &apos;Save&apos; to
									save your Gridify
								</p>
								<button
									onClick={handleDownloadImage}
									className="btn btn-primary"
								>
									{showCanvas ? (
										<LoadingSpinner
											color="black"
											width={20}
											height={20}
										/>
									) : (
										<p className="flex items-center gap-2 text-lg">
											<IoDownloadOutline />
											Save
										</p>
									)}
								</button>
							</div>
						</Section>
					</CenterStage>
				</Container>

				{/* {showCanvas && ( */}
				<Canvas
					itemRef={saveItemRef}
					user={user}
					top={top}
					played={played}
				/>
				{/* )} */}

				{/* <ShareButton overrideText="Share" /> */}
			</div>
		</>
	);
};

function Canvas({
	itemRef,
	user,
	top,
	played,
}: {
	itemRef: Ref<HTMLDivElement>;
	user: any;
	top: any;
	played: any;
}) {
	console.table(top);
	function myLoader({ src, width, quality }: any) {
		return `${src}?w=${width}&q=${quality || 75}`;
	}
	return (
		<div
			ref={itemRef}
			style={{
				backgroundColor: '#111',
			}}
			className="background w-[750px] aspect-[9/16] flex items-center justify-center px-20"
		>
			<div className="wrapper-items text-center">
				<h2 className="text-lg font-bold my-5">
					{DateTime.now().toFormat('MMMM')}&apos;s Top Songs
				</h2>

				<div className=" my-5 flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg border border-white/30 w-full h-full">
					<picture>
						<img
							width={80}
							height={80}
							src={user.spotify_users.profile_pic_url}
							className="rounded-full"
							alt={user.name}
						/>
					</picture>

					<div>
						<p className="font-bold m-0 text-lg">{user.name}</p>
						<p className="muted text-left m-0">@{user.username}</p>
					</div>

					{/* <div className="statistics text-xs flex justify-between">
										<table>
											<tbody>
												<tr>
													<td className="font-bold">
														{played[0].name}
													</td>
													<td>
														<p>
															x{played[0].amount}
														</p>
													</td>
												</tr>

												<tr>
													<td className="font-bold">
														{
															played[
																played.length -
																	1
															].name
														}
													</td>
													<td>
														<p>
															x
															{
																played[
																	played.length -
																		1
																].amount
															}
														</p>
													</td>
												</tr>
											</tbody>
										</table>
									</div> */}
				</div>

				<div className="wrapper-content border border-white/30 rounded-lg">
					<div className="grid-content bg-white/5 p-3">
						{/* Album art grid */}
						<div className="grid grid-cols-4 gap-5">
							{top
								.slice(0, 12)
								.map((song: any, index: number) => {
									// console.log(song.color);

									// console.log(chroma(song.color).hex());
									return (
										<div
											key={index}
											style={{
												boxShadow: `0 0 50px ${song.color}`,
												background: `${chroma(
													song.color
												)
													.darken(0.8)
													.hex()}`,
												border: `2px solid ${chroma(
													song.color
												)
													.darken(0.1)
													.hex()}`,
											}}
											className={`rounded-lg border border-white/60`}
										>
											<picture>
												<img
													src={`data:image/jpeg;base64, ${song.album_art_base64}`}
													className="rounded-tr-lg rounded-tl-lg"
													alt={song.name}
												/>
											</picture>

											<div className="flex flex-col items-center justify-center text p-2 h-100">
												<p className="text-xs font-bold m-0">
													{song.name}
												</p>

												<p className="text-xs muted m-0">
													{song.artists
														.map((a: any) => a.name)
														.join(', ')}
												</p>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>

				<p className="my-5 text-center text-sm text-text/70">
					https://musicn.vercel.app/user/
					{user.username}
				</p>

				{/* <p className="text-xs muted">
					Generated on {DateTime.now().toFormat('DDD')}
				</p> */}
			</div>
		</div>
	);
}

function Nothing({ text }: { text: string }) {
	return (
		<div className="text-text/50 text-center my-20">
			<p>{text}</p>
		</div>
	);
}

export default GridifyHome;
