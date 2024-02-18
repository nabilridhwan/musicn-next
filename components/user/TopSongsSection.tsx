import getTopSongs from '@/api/getTopSongs';
import SongCard from '@/components/SongCard';

export default async function TopSongsSection({username}: {username: string}) {
  const topSongsData = await getTopSongs(username);

  return (
    <div className={'grid grid-cols-2 lg:grid-cols-5 gap-2'}>
      {topSongsData?.map((song: any) => (
        <SongCard
          key={song.id}
          name={song.name}
          artists={song.artists.map((a: any) => a.name).join(', ')}
          imageUrl={song.album_art}
          preview={song.preview}
          spotifyLink={`https://open.spotify.com/track/${song.id}`}
        />
      ))}
    </div>
  );
}
