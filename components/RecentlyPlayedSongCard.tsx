import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { MusicPreviewDialogContext } from '../context/MusicPreviewDialogProvider';
type SongCardProps = {
	name: string;
	spotifyLink: string;
	artists: string;
	imageUrl: string;
	preview: string;
	played_at: string;
};
const RecentlyPlayedSongCard = ({
	name,
	spotifyLink,
	artists,
	imageUrl,
	preview,
	played_at,
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
				scale: 1.01,
			}}
			whileTap={{
				scale: 0.9,
			}}
			className="cursor-pointer"
			data-test-id="song-card"
			onClick={handleSongClick}
		>
			<div className="flex flex-row items-center border border-white/20 rounded-lg gap-5">
				<img
					className="w-auto h-32 rounded-tl-lg rounded-bl-lg"
					src={imageUrl}
				/>

				<section className="py-5 px-3">
					<p className="uppercase text-sm mb-4 tracking-wider muted">
						{DateTime.fromISO(played_at).toRelative()}
					</p>

					<p data-test-id="song-name" className="font-bold">
						{name}
					</p>
					<p className="muted text-sm mb-0">{artists}</p>
				</section>
			</div>
		</motion.div>
	);
};

export default RecentlyPlayedSongCard;
