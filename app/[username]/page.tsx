import RecentlyPlayedSongCard from '@/components/RecentlyPlayedSongCard';
import SongCard from '@/components/SongCard';
import getCurrentSong from '@/api/getCurrentSong';
import getRecentSongs from '@/api/getRecentSongs';
import getTopSongs from '@/api/getTopSongs';
import UserHeader from '@/components/user/UserHeader';
import {getUserByUsername_public} from '@/model/users';
import type {Metadata, ResolvingMetadata} from 'next';
import {Suspense} from 'react';
import TopSongsSection from '@/components/user/TopSongsSection';
import {Container, Stack} from '@chakra-ui/react';

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

  const recentSongsData = await getRecentSongs(username);
  const currentSongsData = await getCurrentSong(username);

  // const [currentSection, setCurrentSection] = useState<SECTION>(
  //   SECTION.TOP_SONGS,
  // );
  //
  // const [currentTitle, setCurrentTitle] = useState<string>(sections[0].title);
  //
  // const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <Container maxW={'6xl'} px={10}>
      <Stack gap={5} alignItems={'center'}>
        {/*<div>*/}
        {/*  <p>user: {JSON.stringify(user, null, 2)}</p>*/}
        {/*  <br />*/}
        {/*  <p>recent: {JSON.stringify(recentSongsData, null, 2)}</p>*/}

        {/*  <br />*/}

        {/*  <p>top: {JSON.stringify(topSongsData, null, 2)}</p>*/}

        {/*  <br />*/}
        {/*  <p>top: {JSON.stringify(topSongsData, null, 2)}</p>*/}

        {/*  <br />*/}
        {/*  <p>top: {JSON.stringify(topSongsData, null, 2)}</p>*/}
        {/*  <p>current: {JSON.stringify(currentSongsData, null, 2)}</p>*/}
        {/*</div>*/}

        <Suspense fallback={<p>Loading user</p>}>
          <UserHeader username={username} />
        </Suspense>

        <Suspense fallback={<p>Loading top songs</p>}>
          <TopSongsSection username={username} />
        </Suspense>

        {/*    name="description"*/}
        {/*    content={`Check out my profile! My top songs are ${top*/}
        {/*      .slice(0, 3)*/}
        {/*      .map((song: any) => song.name)*/}
        {/*      .join(', ')}`}></meta>*/}
        {/*</Head>*/}

        {/*<Container my={10} maxW={'container.lg'}>*/}
        {/*  <Center>*/}
        {/*    <UserHeader*/}
        {/*      num_of_visitors={user.num_of_visitors as unknown as number}*/}
        {/*      username={user.username || ''}*/}
        {/*      display_name={user.name}*/}
        {/*      profile_pic_url={user.spotify_users.profile_pic_url || ''}*/}
        {/*      spotify_userid={user.spotify_users.spotify_userid}*/}
        {/*    />*/}
        {/*  </Center>*/}

        {/*  <Center my={5}>*/}
        {/*    {currentSongStatus === 'success' && (*/}
        {/*      <>*/}
        {/*        {Object.keys(currentSongData).length > 0 && (*/}
        {/*          <Box my={5}>*/}
        {/*            <CurrentlyPlayingSongCard*/}
        {/*              name={currentSongData.name}*/}
        {/*              artists={currentSongData.artists*/}
        {/*                .map((a: any) => a.name)*/}
        {/*                .join(', ')}*/}
        {/*              imageUrl={currentSongData.album_art}*/}
        {/*              spotifyLink={`https://open.spotify.com/track/${currentSongData.id}`}*/}
        {/*              preview={currentSongData.preview}*/}
        {/*            />*/}
        {/*          </Box>*/}
        {/*        )}*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </Center>*/}

        {/*  /!*Tab buttons*!/*/}
        {/*  <HStack w={'fit-content'} mt={40} my={5}>*/}
        {/*    <Button*/}
        {/*      p={2}*/}
        {/*      fontSize={'sm'}*/}
        {/*      bg={currentSection === SECTION.TOP_SONGS ? 'gray.700' : 'gray.800'}*/}
        {/*      onClick={() => setCurrentSection(SECTION.TOP_SONGS)}>*/}
        {/*      Top Songs*/}
        {/*    </Button>*/}

        {/*    <Button*/}
        {/*      p={2}*/}
        {/*      fontSize={'sm'}*/}
        {/*      bg={*/}
        {/*        currentSection === SECTION.RECENTLY_PLAYED_SONGS*/}
        {/*          ? 'gray.700'*/}
        {/*          : 'gray.800'*/}
        {/*      }*/}
        {/*      onClick={() => setCurrentSection(SECTION.RECENTLY_PLAYED_SONGS)}>*/}
        {/*      Recently Played Songs*/}
        {/*    </Button>*/}
        {/*  </HStack>*/}

        {/*  {currentSection === SECTION.TOP_SONGS && (*/}
        {/*    <>*/}
        {/*      <SimpleGrid columns={[2, 3, 5]} gap={5}>*/}
        {/*        {top.map((currentSong: any) => (*/}
        {/*          <SongCard*/}
        {/*            key={currentSong.id}*/}
        {/*            name={currentSong.name}*/}
        {/*            artists={currentSong.artists*/}
        {/*              .map((a: any) => a.name)*/}
        {/*              .join(', ')}*/}
        {/*            imageUrl={currentSong.album_art}*/}
        {/*            preview={currentSong.preview}*/}
        {/*            spotifyLink={`https://open.spotify.com/track/${currentSong.id}`}*/}
        {/*          />*/}
        {/*        ))}*/}

        {/*        {top.length === 0 && (*/}
        {/*          <Nothing*/}
        {/*            text={'No top songs or the user has made it private :('}*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      </SimpleGrid>*/}
        {/*    </>*/}
        {/*  )}*/}

        {/*  {currentSection === SECTION.RECENTLY_PLAYED_SONGS && (*/}
        {/*    <>*/}
        {/*      <Grid gap={5}>*/}
        {/*        {recentSongsStatus === 'success' &&*/}
        {/*          recentSongsData.map((currentSong: any) => (*/}
        {/*            <RecentlyPlayedSongCard*/}
        {/*              key={currentSong.id}*/}
        {/*              name={currentSong.name}*/}
        {/*              artists={currentSong.artists*/}
        {/*                .map((a: any) => a.name)*/}
        {/*                .join(', ')}*/}
        {/*              imageUrl={currentSong.album_art}*/}
        {/*              preview={currentSong.preview}*/}
        {/*              played_at={currentSong.played_at}*/}
        {/*              spotifyLink={`https://open.spotify.com/track/${currentSong.id}`}*/}
        {/*            />*/}
        {/*          ))}*/}
        {/*      </Grid>*/}

        {/*      {isRecentSongsError &&*/}
        {/*        (typeof recentSongsData === 'undefined' ||*/}
        {/*          recentSongsData.length === 0) && (*/}
        {/*          <Nothing*/}
        {/*            text={*/}
        {/*              'No recently played songs or the user has made it private :('*/}
        {/*            }*/}
        {/*          />*/}
        {/*        )}*/}

        {/*      {isRecentSongsLoading && <LoadingSpinner />}*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</Container>*/}
        {/*/!* <ShareButton overrideText="Share" /> *!/*/}
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
