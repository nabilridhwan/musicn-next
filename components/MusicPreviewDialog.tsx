import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { IoClose, IoPause, IoPlay, IoStop } from 'react-icons/io5';
import { MusicPreviewDialogContext } from '../context/MusicPreviewDialogProvider';

export type MusicPreview = {
	title: string;
	artist: string;
	image: string;
	preview?: string;
	url: string;
};

type MusicPreviewDialogProps = {
	handleClose: () => void;
};

export default function MusicPreviewDialog({
	handleClose,
}: MusicPreviewDialogProps) {
	const {
		showDialog,
		showSongPreview,
		hideSongPreview,
		songDetails,
		setVolume,
		volume,
	} = useContext(MusicPreviewDialogContext);
	const audioElemRef = React.useRef<HTMLAudioElement>(null);

	const [isPlaying, setIsPlaying] = React.useState<boolean>(true);

	useEffect(() => {
		setIsPlaying(true);
	}, [songDetails]);

	useEffect(() => {
		if (audioElemRef.current) {
			audioElemRef.current.volume = parseFloat(volume());
		}
	}, [audioElemRef, volume]);

	function handlePlay() {
		setIsPlaying(!isPlaying);

		if (audioElemRef.current) {
			if (isPlaying) {
				audioElemRef.current.pause();
			} else {
				audioElemRef.current.play();
			}
		}
	}

	function handleVolumeChange(e: any) {
		setVolume(e.target.volume);
	}

	return (
		<>
			<AnimatePresence>
				{songDetails && showDialog && (
					<motion.div className="flex justify-center">
						{/* Content */}
						<motion.div
							initial={{ opacity: 0, y: 100 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 100 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							className="flex border border-white/30 bg-black/50 backdrop-blur-xl items-center justify-between rounded-xl fixed bottom-8 gap-1 px-5 z-10 shadow-black/50 shadow-[0_0_50px] w-11/12 mx-auto"
						>
							{/* Song details */}
							<div className="flex items-center gap-2 my-3">
								<picture>
									<img
										width={40}
										height={40}
										className="m-auto rounded-lg drop-shadow-md"
										src={songDetails.image}
										alt={songDetails.title}
									/>
								</picture>

								<Link href={songDetails.url + '?go=1'}>
									<div>
										<h2
											data-test-id="preview-song-name"
											className="font-bold my-0 text-xs"
										>
											{songDetails.title.slice(0, 23)}
											{songDetails.title.length > 23 &&
												'...'}
										</h2>

										<p className="muted text-xs">
											{songDetails.artist.slice(0, 23)}
											{songDetails.artist.length > 23 &&
												'...'}
										</p>
									</div>
								</Link>
							</div>

							{/* Show the audio dialog only if there is a song preview */}
							{songDetails.preview && (
								<audio
									onEnded={() => {
										setIsPlaying(false);
									}}
									onTimeUpdate={(e) => {
										console.log(
											(e.target as any).currentTime
										);

										console.log((e.target as any).duration);
									}}
									ref={audioElemRef}
									src={songDetails.preview}
									// TODO: Handle volume change
									onVolumeChange={handleVolumeChange}
									autoPlay
								/>
							)}

							<div className="buttons flex gap-2.5">
								{songDetails.preview && (
									<>
										<motion.button
											whileHover={{ scale: 1.07 }}
											whileTap={{ scale: 0.9 }}
											onClick={handlePlay}
											className="cursor-pointer border border-white/20 flex items-center gap-1 bg-white/10 backdrop-blur-md p-2 rounded-lg"
										>
											{isPlaying ? (
												<IoPause />
											) : (
												<IoPlay />
											)}
										</motion.button>

										<motion.button
											whileHover={{ scale: 1.07 }}
											whileTap={{ scale: 0.9 }}
											onClick={handleClose}
											className="cursor-pointer border border-white/20 flex items-center gap-1 bg-white/10 backdrop-blur-md p-2 rounded-lg"
										>
											<IoStop />
										</motion.button>

										<motion.button
											whileHover={{ scale: 1.07 }}
											whileTap={{ scale: 0.9 }}
											onClick={handleClose}
											className="cursor-pointer border border-white/20 flex items-center gap-1 bg-white/20 backdrop-blur-md p-2 rounded-lg"
										>
											<IoClose />
										</motion.button>
									</>
								)}

								<Link href={songDetails.url + '?go=1'}>
									<motion.button
										whileHover={{ scale: 1.07 }}
										whileTap={{ scale: 0.9 }}
										className="cursor-pointer border border-white/20 flex items-center gap-1 bg-white/20 backdrop-blur-md p-2 rounded-lg"
									>
										<FaSpotify />
									</motion.button>
								</Link>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

function NoPreviewAvailable() {
	return (
		<div className="flex items-center gap-2 border border-white/50 w-fit p-3 px-6 rounded-lg">
			<section>
				<p className="muted text-sm mb-0">
					No preview available :&apos;(
				</p>
			</section>
		</div>
	);
}
