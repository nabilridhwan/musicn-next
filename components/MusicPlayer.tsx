type MusicPlayerProps = {
	name: string;
	spotifyLink: string;
	artists: string;
	imageUrl: string;
};
const MusicPlayer = ({
	name,
	spotifyLink,
	artists,
	imageUrl,
}: MusicPlayerProps) => {
	return (
		<div className="flex items-center gap-2 border border-white w-fit p-2 px-2 rounded-lg">
			<img className="w-12 h-12" src={imageUrl} />

			<section>
				<p className="font-bold">{name}</p>
				<p className="muted text-sm mb-0">{artists}</p>
			</section>
		</div>
	);
};

export default MusicPlayer;
