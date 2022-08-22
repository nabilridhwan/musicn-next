import { motion } from 'framer-motion';
import Link from 'next/link';
type SongCardProps = {
	name: string;
	spotifyLink: string;
	artists: string;
	imageUrl: string;
};
const SongCard = ({ name, spotifyLink, artists, imageUrl }: SongCardProps) => {
	return (
		<motion.div
			whileHover={{
				scale: 1.1,
			}}
			whileTap={{
				scale: 0.9,
			}}
		>
			<Link href={spotifyLink ?? ''}>
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
			</Link>
		</motion.div>
	);
};

export default SongCard;
