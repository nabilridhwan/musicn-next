import CenterStage from '@/components/CenterStage';
import Section from '@/components/Section';
import getTopSongs from '@/frontend-api/song/getTopSongs';
import getUserDetails from '@/frontend-api/user/getUserDetails';
import axios from 'axios';
import html2canvas from 'html2canvas';
import Head from 'next/head';
import { useRef } from 'react';
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
	} catch (error) {
		console.log(error);
		return {
			redirect: {
				destination: '/users',
				permanent: false,
			},
		};
	}
}

const GridifyHome = ({ user, top }: UsersProps) => {
	const saveItemRef = useRef(null);

	const handleDownloadImage = async () => {
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
			<Container>
				<CenterStage>
					<Section>
						<div className="flex flex-col items-center justify-center my-10">
							<button
								onClick={handleDownloadImage}
								className="btn btn-primary"
							>
								Save
							</button>
						</div>

						<div
							ref={saveItemRef}
							style={{
								backgroundColor: 'black',
							}}
							className="background w-[500px] aspect-[9/16] flex items-center justify-center px-20"
						>
							<div className="wrapper-items">
								<div className="wrapper-content border border-white/30 rounded-lg">
									<div className="flex items-center gap-2 bg-white/10 p-3 py-5 rounded-lg border border-white/30">
										<picture>
											<img
												src={
													user.spotify_users
														.profile_pic_url
												}
												className="rounded-full w-14 h-14"
												alt={user.name}
											/>
										</picture>

										<div>
											<p className="font-bold">
												{user.name}
											</p>
											<p className="muted text-sm">
												@{user.username}
											</p>
										</div>
									</div>

									<div className="grid-content bg-white/5 p-3">
										<p className="my-3 text-sm muted">
											Top songs of the month
										</p>
										<div className="grid grid-cols-4 gap-4">
											{top
												.slice(0, 12)
												.map(
													(
														song: any,
														index: number
													) => (
														<picture key={index}>
															<img
																src={
																	song.album_art
																}
																alt={song.name}
															/>
														</picture>
													)
												)}
										</div>
									</div>
								</div>

								<p className="my-5 text-center text-sm text-text/70">
									https://musicn.vercel.app/user/
									{user.username}
								</p>
							</div>
						</div>
					</Section>
				</CenterStage>
			</Container>

			{/* <ShareButton overrideText="Share" /> */}
		</>
	);
};

function Nothing({ text }: { text: string }) {
	return (
		<div className="text-text/50 text-center my-20">
			<p>{text}</p>
		</div>
	);
}

export default GridifyHome;
