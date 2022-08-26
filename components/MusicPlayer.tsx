import { motion } from 'framer-motion';
import { useContext } from 'react';

import { Audio } from 'react-loader-spinner';
import {
	MusicPreview,
	MusicPreviewDialogContext,
} from '../context/MusicPreviewDialogProvider';

type MusicPlayerProps = {
	name: string;
	spotifyLink: string;
	artists: string;
	imageUrl: string;
	preview: string;
};

export const MusicPlayer = ({
	name,
	spotifyLink,
	artists,
	imageUrl,
	preview,
}: MusicPlayerProps) => {
	const { showSongPreview, hideSongPreview, songDetails, setVolume } =
		useContext(MusicPreviewDialogContext);

	const handleSongClick = () => {
		const song: MusicPreview = {
			title: name,
			artist: artists,
			image: imageUrl,
			preview,
			url: spotifyLink,
		};

		console.log(preview);

		showSongPreview(song);
	};

	return (
		<motion.div
			className="cursor-pointer"
			whileHover={{
				scale: 1.1,
			}}
			whileTap={{
				scale: 0.9,
			}}
		>
			<div
				onClick={handleSongClick}
				className="flex items-center gap-3 border border-white/20 w-fit rounded-lg p-2"
			>
				<picture>
					<img
						alt={'album-cover'}
						className="w-10 h-10"
						src={imageUrl}
					/>
				</picture>

				<section className="px-2">
					<p className="font-bold flex items-center justify-center gap-1">
						{name.length > 23
							? (name as string).slice(0, 23) + '...'
							: name}
					</p>
					<p className="muted text-sm mb-0">
						{artists.length > 25
							? (artists as string).slice(0, 25) + '...'
							: artists}
					</p>
				</section>

				<Audio
					height="18"
					width="18"
					color="rgba(255,255,255,0.7)"
					wrapperClass="mr-1"
					ariaLabel="three-dots-loading"
				/>
			</div>
		</motion.div>
	);
};

export const MusicPlayerNotPlaying = () => {
	return (
		<div className="flex items-center gap-2 border border-white/50 w-fit p-3 px-6 rounded-lg">
			{/* <img className="w-12 h-12" src={imageUrl} /> */}

			{/* <section>
				<p className="font-bold">{name}</p>
				<p className="muted text-sm mb-0">{artists}</p>
			</section> */}

			<section>
				<p className="muted text-sm mb-0">nothing :&apos;(</p>
			</section>
		</div>
	);
};

export const MusicPlayerError = () => {
	return (
		<div className="flex items-center gap-2 border border-red-500 w-fit p-2 px-2 rounded-lg">
			{/* <img className="w-12 h-12" src={imageUrl} /> */}

			{/* <section>
				<p className="font-bold">{name}</p>
				<p className="muted text-sm mb-0">{artists}</p>
			</section> */}

			<section>
				<p className="text-sm mb-0 text-red-500">
					There was an error fetching currently playing song
				</p>
			</section>
		</div>
	);
};
