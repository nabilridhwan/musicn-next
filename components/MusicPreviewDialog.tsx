import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext, useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
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

export default function MusicPreviewDialog({ handleClose }: MusicPreviewDialogProps) {
	const { showDialog, showSongPreview, hideSongPreview, songDetails, setVolume, volume } = useContext(MusicPreviewDialogContext);
	const audioElemRef = React.useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (audioElemRef.current) {
			audioElemRef.current.volume = parseFloat(volume());
		}
	}, [audioElemRef, volume]);

	function handleVolumeChange(e: any) {
		setVolume(e.target.volume);
	}

	return (
		<>
			<AnimatePresence>
				{songDetails && showDialog && (
					<Dialog open={showDialog && songDetails !== null} onClose={handleClose}>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								type: 'tween',
								duration: 0.15,
								ease: 'easeInOut',
							}}
						>
							<div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60">
								<Dialog.Panel className="w-full max-w-sm rounded-2xl border border-white/20 bg-black my-10 text-center p-10 shadow-[0_0_50px] shadow-black">
									{/* Top (Title and Button) */}
									<Dialog.Title className="text-white font-bold text-center">
										{songDetails.preview ? 'Music Preview' : 'Song'}
									</Dialog.Title>

									{/* Content */}
									<div className="flex items-center justify-center flex-col">
										<div className="my-5">
											<picture className="w-full h-full">
												<img width={200} height={200} className="m-auto" src={songDetails.image} alt={songDetails.title} />
											</picture>

											<h2 className="font-bold text-lg mt-10 ">{songDetails.title}</h2>

											<p className="muted">{songDetails.artist}</p>
										</div>

										{/* Show the audio dialog only if there is a song preview */}
										{songDetails.preview ? (
											<audio
												ref={audioElemRef}
												src={songDetails.preview}
												// TODO: Handle volume change
												onVolumeChange={handleVolumeChange}
												controls
												autoPlay
											/>
										) : (
											<NoPreviewAvailable />
										)}

										<a
											href={songDetails.url + '?go=1'}
											className="cursor-pointer flex items-center w-full gap-1 bg-spotify p-2 px-4 rounded-lg mt-10"
										>
											<FaSpotify />
											Open In Spotify
										</a>

										<button
											onClick={handleClose}
											className="cursor-pointer flex items-center w-full gap-1 bg-red-500 p-2 px-4 rounded-lg mt-4"
										>
											<IoClose />
											Close
										</button>
									</div>
								</Dialog.Panel>
							</div>
						</motion.div>
					</Dialog>
				)}
			</AnimatePresence>
		</>
	);
}

function NoPreviewAvailable() {
	return (
		<div className="flex items-center gap-2 border border-white/50 w-fit p-3 px-6 rounded-lg">
			<section>
				<p className="muted text-sm mb-0">No preview available :&apos;(</p>
			</section>
		</div>
	);
}
