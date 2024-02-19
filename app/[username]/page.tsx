import getCurrentSong from '@/api/getCurrentSong';
import UserHeader from '@/components/user/UserHeader';
import type {Metadata, ResolvingMetadata} from 'next';
import {Suspense} from 'react';
import TopSongsSection from '@/components/user/TopSongsSection';
import {Container, Stack} from '@chakra-ui/react';
import {getUserByUsername_public} from '@/model/users';
import {redirect} from 'next/navigation';
import {CurrentlyPlayingSongCard} from '@/components/user/CurrentlyPlayingSongCard';

type PageProps = {
  params: {username: string};
};

export async function generateMetadata(
  {params}: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: params.username,
    description: params.username,
  };
}

enum SECTION {
  TOP_SONGS = 'top_songs',
  RECENTLY_PLAYED_SONGS = 'recently_played_songs',
}

const sections = [
  {
    title: 'Top Songs',
    enum: SECTION.TOP_SONGS,
  },
  {
    title: 'Recently Played Songs',
    enum: SECTION.RECENTLY_PLAYED_SONGS,
  },
];

const UserPage = async ({params: {username: _username}}: PageProps) => {
  // TODO: Extract this into a function to get the username
  // const username = ((params?.username as string) || '').split('%40')[1];
  const username = _username.split('%40')[1];

  const user = await getUserByUsername_public(username);

  // const recentSongsData = await getRecentSongs(username);
  const currentSongsData = await getCurrentSong(username);

  if (!user?.spotify_users) {
    return redirect('/users');
  }

  // const [currentSection, setCurrentSection] = useState<SECTION>(
  //   SECTION.TOP_SONGS,
  // );
  //
  // const [currentTitle, setCurrentTitle] = useState<string>(sections[0].title);
  //
  // const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <Container maxW={'6xl'} px={6}>
      <Stack gap={5} alignItems={'center'}>
        {/*<div>*/}
        {/*  <p>user: {JSON.stringify(user, null, 2)}</p>*/}
        {/*  <br />*/}
        {/*  <p>recent: {JSON.stringify(recentSongsData, null, 2)}</p>*/}

        {/*  <br />*/}

        {/*  <p>current: {JSON.stringify(currentSongsData, null, 2)}</p>*/}
        {/*</div>*/}

        <Suspense fallback={<p>Loading user</p>}>
          {/* @ts-expect-error Server Component */}
          <UserHeader username={username} />
        </Suspense>

        <Suspense fallback={<p>Loading currently playing song</p>}>
          {currentSongsData && (
            <CurrentlyPlayingSongCard
              name={currentSongsData.name}
              spotifyLink={`https://open.spotify.com/track/${currentSongsData.uri}`}
              artists={currentSongsData.artists.map(n => n.name).join(', ')}
              imageUrl={currentSongsData.album_art}
              preview={currentSongsData.preview || ''}
            />
          )}
        </Suspense>

        <Suspense fallback={<p>Loading top songs</p>}>
          {/* @ts-expect-error Server Component */}
          <TopSongsSection username={username} />
        </Suspense>
      </Stack>
    </Container>
  );
};

function Nothing({text}: {text: string}) {
  return (
    <div className="text-text/50 text-center my-20">
      <p>{text}</p>
    </div>
  );
}

export default UserPage;
