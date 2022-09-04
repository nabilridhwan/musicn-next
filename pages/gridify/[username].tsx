import CenterStage from '@/components/CenterStage';
import LoadingSpinner from '@/components/LoadingSpinner';
import Section from '@/components/Section';
import getTopSongs from '@/frontend-api/song/getTopSongs';
import getUserDetails from '@/frontend-api/user/getUserDetails';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { DateTime } from 'luxon';
import Head from 'next/head';
import { Ref, useRef, useState } from 'react';
import { IoDownloadOutline } from 'react-icons/io5';
import Container from '../../components/Container';

type UsersProps = {
	user: any;
	top: any;
};

export async function getServerSideProps(context: any) {
	const { username } = context.query;

	try {
		let [user, top] = await axios.all([
			getUserDetails(username),
			getTopSongs(username),
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

		return {
			props: {
				user: user,
				top,
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

const GridifyHome = ({ user, top }: UsersProps) => {
	const saveItemRef = useRef(null);

	const [showCanvas, setShowCanvas] = useState(false);

	const handleDownloadImage = async () => {
		setShowCanvas(true);

		setTimeout(async () => {
			const element = saveItemRef.current;
			if (element) {
				const canvas = await html2canvas(element, {
					useCORS: true,
				});

				const data = canvas.toDataURL('image/jpg');
				const link = document.createElement('a');

				if (typeof link.download === 'string') {
					link.href = data;
					link.download = 'image.jpg';

					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					window.open(data);
				}
			}

			setShowCanvas(false);
		}, 500);
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

				{showCanvas && (
					<Canvas itemRef={saveItemRef} user={user} top={top} />
				)}

				{/* <ShareButton overrideText="Share" /> */}
			</div>
		</>
	);
};

function Canvas({
	itemRef,
	user,
	top,
}: {
	itemRef: Ref<HTMLDivElement>;
	user: any;
	top: any;
}) {
	return (
		<div
			ref={itemRef}
			style={{
				backgroundColor: '#111',
			}}
			className="background w-[700px] aspect-[9/16] flex items-center justify-center px-20"
		>
			<div className="wrapper-items text-center">
				<h2 className="text-lg font-bold my-5">
					{DateTime.now().toFormat('MMMM')}&apos;s Top Songs
				</h2>

				<div className="flex items-center justify-center gap-2 w-fit m-auto bg-white/10 p-3 py-5 rounded-lg border border-white/30 my-10">
					<picture>
						<img
							width={60}
							height={60}
							src={user.spotify_users.profile_pic_url}
							className="rounded-full"
							alt={user.name}
						/>
					</picture>

					<div>
						<p className="font-bold m-0">{user.name}</p>
						<p className="muted text-sm text-left m-0">
							@{user.username}
						</p>
					</div>
				</div>
				<div className="wrapper-content border border-white/30 rounded-lg">
					<div className="grid-content bg-white/5 p-3">
						{/* Album art grid */}
						<div className="grid grid-cols-4 gap-2">
							{top
								.slice(0, 12)
								.map((song: any, index: number) => (
									<div key={index}>
										<picture key={index}>
											<img
												src={song.album_art}
												alt={song.name}
											/>
										</picture>

										{/* <p className="text-xs py-3 bg-red-500 h-auto">
											{index + 1}. {song.name}
										</p> */}
									</div>
								))}
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
