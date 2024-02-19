import getTopSongs from '@/api/getTopSongs';
import SongCard from '@/components/SongCard';
import {SimpleGrid} from '@chakra-ui/react';

export default async function TopSongsSection({username}: {username: string}) {
  const topSongsData = await getTopSongs(username);

  return (
    <SimpleGrid columns={[2, 2, 3]} gap={4}>
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
    </SimpleGrid>
  );
}
