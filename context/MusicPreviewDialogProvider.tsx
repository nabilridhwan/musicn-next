import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';

interface MusicPreviewDialogProviderProps {
	children?: ReactNode;
}

type MusicPreview = {
	title: string;
	artist: string;
	album: string;
	image: string;
	preview?: string;
	url: string;
};

export const MusicPreviewDialogContext = React.createContext<any>(null);

export default function MusicPreviewDialogProvider({
	children,
}: MusicPreviewDialogProviderProps) {
	const [showDialog, setShowDialog] = React.useState<boolean>(false);
	const [songDetails, setSongDetails] = React.useState<MusicPreview | null>(
		null
	);

	const [_volume, _setVolume] = React.useState<number>(0.5);

	const showSongPreview = (song: MusicPreview) => {
		setShowDialog(true);
		setSongDetails(song);
	};

	const hideSongPreview = () => {
		setShowDialog(false);
		setSongDetails(null);
	};

	const setVolume = (volume: number) => {
		// Save to localStorage
		localStorage.setItem('volume', volume.toString());
		_setVolume(volume);
	};

	return (
		<MusicPreviewDialogContext.Provider
			value={{
				showSongPreview,
				hideSongPreview,
				songDetails,
				setSongDetails,
				setVolume: _setVolume,
			}}
		>
			{children}

			{showDialog && songDetails && (
				<MusicPreviewDialog
					songDetails={songDetails}
					handleClose={hideSongPreview}
					volume={_volume}
					setVolume={setVolume}
				/>
			)}
		</MusicPreviewDialogContext.Provider>
	);
}

type MusicPreviewDialogProps = {
	songDetails: MusicPreview;
	volume: number;
	setVolume: (volume: number) => void;
	handleClose: () => void;
};

function MusicPreviewDialog({
	songDetails,
	handleClose,
	volume,
}: MusicPreviewDialogProps) {
	const audioElemRef = React.useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (audioElemRef.current) {
			audioElemRef.current.volume = volume;
		}
	}, [audioElemRef, volume]);

	return (
		<div>
			<picture>
				<img src={songDetails.image} alt={songDetails.title} />
			</picture>
			<h3>{songDetails.title}</h3>
			<p>{songDetails.artist}</p>

			<Link href={songDetails.url}>
				<a>Spotify</a>
			</Link>

			{/* Show the audio dialog only if there is a song preview */}
			{songDetails.preview && (
				<audio
					ref={audioElemRef}
					src={songDetails.preview}
					// TODO: Handle volume change
					onVolumeChange={(e) => {
						console.log(e);
					}}
					controls
					autoPlay
				/>
			)}

			<button onClick={handleClose}>Close</button>
		</div>
	);
}
