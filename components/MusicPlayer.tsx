import { motion } from 'framer-motion';
import Link from 'next/link';

import { Audio } from 'react-loader-spinner';

type MusicPlayerProps = {
	name: string;
	spotifyLink: string;
	artists: string;
	imageUrl: string;
};

export const MusicPlayer = ({
	name,
	spotifyLink,
	artists,
	imageUrl,
}: MusicPlayerProps) => {
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
			<Link href={spotifyLink}>
				<div className="flex items-center gap-2 border border-white/50 w-fit rounded-lg">
					<img
						className="w-12 h-12 rounded-tl-lg rounded-bl-lg"
						src={imageUrl}
					/>

					<section className="px-2">
						<p className="font-bold text-sm flex items-center justify-center gap-1">
							<Audio
								height="15"
								width="15"
								color="white"
								ariaLabel="three-dots-loading"
							/>
							{name.length > 25
								? (name as string).slice(0, 25) + '...'
								: name}
						</p>
						<p className="muted text-sm mb-0">
							{artists.length > 25
								? (artists as string).slice(0, 25) + '...'
								: artists}
						</p>
					</section>
				</div>
			</Link>
		</motion.div>
	);
};

export const MusicPlayerNotPlaying = () => {
	return (
		<div className="flex items-center gap-2 border border-white/50 w-fit p-2 px-2 rounded-lg">
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
