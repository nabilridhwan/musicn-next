import LoadingSpinner from '@/components/LoadingSpinner';
import {
  MusicPlayer,
  MusicPlayerError,
  MusicPlayerNotPlaying,
  MusicPlayerPrivate,
} from '@/components/MusicPlayer';
import RecentlyPlayedSongCard from '@/components/RecentlyPlayedSongCard';
import SongCard from '@/components/SongCard';
import getCurrentSong from '@/frontend-api/song/getCurrentSong';
import getRecentSongs from '@/frontend-api/song/getRecentSongs';
import getTopSongs from '@/frontend-api/song/getTopSongs';
import getUserDetails from '@/frontend-api/user/getUserDetails';
import styles from '@/styles/UserPage.module.css';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {motion} from 'framer-motion';
import Head from 'next/head';
import {useEffect, useState} from 'react';
import {FaSpotify} from 'react-icons/fa';
import DefaultProfilePicture from '../components/DefaultProfilePicture';
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Heading,
  HStack,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import UserCard from '@/components/UserCard';

type UsersProps = {
  user: any;
  top: any;
};

export async function getServerSideProps(context: any) {
  let {username} = context.query;
  username = username.toLowerCase().split('@')[1];

  try {
    let [user, top] = await axios.all([
      getUserDetails(username),
      getTopSongs(username),
    ]);

    if (!user.spotify_users) {
      throw new Error('No spotify user found');
    }

    console.log(user);

    if (user.preferences.account === false) {
      throw new Error('Account is not visible to the public');
    }

    if (user.preferences.top === false) {
      top = [];
    }

    return {
      props: {
        user: user,
        top,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/users',
        permanent: false,
      },
    };
  }
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

const UserPage = ({user, top}: UsersProps) => {
  const [currentSection, setCurrentSection] = useState<SECTION>(
    SECTION.TOP_SONGS,
  );

  const [currentTitle, setCurrentTitle] = useState<string>(sections[0].title);

  const [imageLoadError, setImageLoadError] = useState(false);

  const {
    data: recentSongsData,
    isLoading: isRecentSongsLoading,
    isError: isRecentSongsError,
    isSuccess: isRecentSongsSuccess,
    status: recentSongsStatus,
    refetch: refetchRecentSongs,
  } = useQuery(
    ['recentSongs', user.username],
    async () => await getRecentSongs(user.username),
    {retry: 2},
  );

  const {
    data: currentSongData,
    isLoading: isCurrentSongLoading,
    isError: isCurrentSongError,
    isSuccess: isCurrentSongSuccess,
    status: currentSongStatus,
  } = useQuery(
    ['currentSongs', user.username],
    async () => await getCurrentSong(user.username),
    {retry: 2},
  );

  // const {
  // 	data: topSongsData,
  // 	isLoading: isTopSongsLoading,
  // 	isError: isTopSongsError,
  // 	isSuccess: isTopSongsSuccess,
  // 	status: topSongsStatus,
  // } = useQuery(
  // 	['topSongs', user.username],
  // 	async () => await getTopSongs(user.username),
  // 	{ onSuccess: (d) => console.log(d) }
  // );

  useEffect(() => {
    if (currentSection === SECTION.TOP_SONGS) {
      setCurrentTitle(sections[0].title);
    } else {
      refetchRecentSongs();
      setCurrentTitle(sections[1].title);
    }
  }, [currentSection]);

  return (
    <>
      <Head>
        <title>{decodeURI(user.username)}&apos;s Profile</title>

        <meta
          name="description"
          content={`Check out my profile! My top songs are ${top
            .slice(0, 3)
            .map((song: any) => song.name)
            .join(', ')}`}></meta>
      </Head>

      <Container maxW={'container.lg'}>
        <Center>
          <UserCard
            username={user.username}
            display_name={user.name}
            profile_pic_url={user.spotify_users.profile_pic_url}
            spotify_userid={user.spotify_users.spotify_userid}
          />
        </Center>

        <Center my={5}>
          {currentSongStatus === 'success' && (
            <>
              {Object.keys(currentSongData).length > 0 && (
                <Box my={5}>
                  <MusicPlayer
                    name={currentSongData.name}
                    artists={currentSongData.artists
                      .map((a: any) => a.name)
                      .join(', ')}
                    imageUrl={currentSongData.album_art}
                    spotifyLink={`https://open.spotify.com/track/${currentSongData.id}`}
                    preview={currentSongData.preview}
                  />
                </Box>
              )}
            </>
          )}
        </Center>

        <Tabs variant={'enclosed'}>
          <TabList>
            <Tab>Top</Tab>
            <Tab>Recently Played</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <>
                <SimpleGrid columns={[2, 3, 4]} gap={5}>
                  {top.map((currentSong: any) => (
                    <SongCard
                      key={currentSong.id}
                      name={currentSong.name}
                      artists={currentSong.artists
                        .map((a: any) => a.name)
                        .join(', ')}
                      imageUrl={currentSong.album_art}
                      preview={currentSong.preview}
                      spotifyLink={`https://open.spotify.com/track/${currentSong.id}`}
                    />
                  ))}

                  {top.length === 0 && (
                    <Nothing
                      text={'No top songs or the user has made it private :('}
                    />
                  )}
                </SimpleGrid>
              </>
            </TabPanel>
            <TabPanel>
              <>
                <Grid gap={5}>
                  {recentSongsStatus === 'success' &&
                    recentSongsData.map((currentSong: any) => (
                      <RecentlyPlayedSongCard
                        key={currentSong.id}
                        name={currentSong.name}
                        artists={currentSong.artists
                          .map((a: any) => a.name)
                          .join(', ')}
                        imageUrl={currentSong.album_art}
                        preview={currentSong.preview}
                        played_at={currentSong.played_at}
                        spotifyLink={`https://open.spotify.com/track/${currentSong.id}`}
                      />
                    ))}
                </Grid>

                {isRecentSongsError &&
                  (typeof recentSongsData === 'undefined' ||
                    recentSongsData.length === 0) && (
                    <Nothing
                      text={
                        'No recently played songs or the user has made it private :('
                      }
                    />
                  )}

                {isRecentSongsLoading && <LoadingSpinner />}
              </>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      {/* <ShareButton overrideText="Share" /> */}
    </>
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
