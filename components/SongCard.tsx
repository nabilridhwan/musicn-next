type SongCardProps = {
	name: string;
	spotifyLink: string;
	artists: string;
	imageUrl: string;
};
const SongCard = ({ name, spotifyLink, artists, imageUrl }: SongCardProps) => {
	return (
		<div className="flex flex-col items-center text-center border border-white rounded-lg">
			<img className="w-full rounded-lg" src={imageUrl} />

			<section className="py-5 px-3">
				<p className="font-bold">{name}</p>
				<p className="muted text-sm mb-0">{artists}</p>
			</section>
		</div>
	);
};

export default SongCard;
