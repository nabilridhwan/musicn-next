import { motion } from 'framer-motion';
import { useContext } from 'react';
import {
	MusicPreview,
	MusicPreviewDialogContext,
} from '../context/MusicPreviewDialogProvider';
type SongCardProps = {
	name: string;
	spotifyLink: string;
	artists: string;
	imageUrl: string;
	preview: string;
};
const SongCard = ({
	name,
	spotifyLink,
	artists,
	imageUrl,
	preview,
}: SongCardProps) => {
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
			whileHover={{
				scale: 1.1,
			}}
			whileTap={{
				scale: 0.9,
			}}
			className="cursor-pointer"
			onClick={handleSongClick}
		>
			<div className="flex flex-col items-center text-center border border-white/20 rounded-lg">
				<img
					className="w-full rounded-tl-lg rounded-tr-lg"
					src={imageUrl}
				/>

				<section className="py-5 px-3">
					<p className="font-bold">{name}</p>
					<p className="muted text-sm mb-0">{artists}</p>
				</section>
			</div>
		</motion.div>
	);
};

export default SongCard;
