import PreferencesSection from '@/components/profile/PreferencesSection';
import Section from '@/components/Section';
import getCurrentSongStatus from '@/services/song/status/getCurrentSongStatus';
import getRecentSongsStatus from '@/services/song/status/getRecentSongsStatus';
import getTopSongsStatus from '@/services/song/status/getTopSongsStatus';
import {getUserById} from '@/model/users';
import {verifyJWT} from '@/util/jwt';
import {useQuery} from '@tanstack/react-query';
import {getCookie} from 'cookies-next';
import {motion} from 'framer-motion';
import {DateTime} from 'luxon';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {FaAccessibleIcon, FaSpotify} from 'react-icons/fa';
import {IoClose, IoPerson} from 'react-icons/io5';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import SongCard from '@/components/SongCard';
import RecentlyPlayedSongCard from '@/components/RecentlyPlayedSongCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import {useRouter} from 'next/router';

export async function getServerSideProps(context: any) {
  // TODO: Check for existing cookies
  const token = getCookie('token', {req: context.req, res: context.res});

  if (token) {
    // Decode JWT token
    try {
      const data = verifyJWT(token.toString());

      const id = data.user_id;

      const user = await getUserById(id);

      if (!user) {
        throw new Error('User not found');
      }

      const {username, email, name, spotify_users, preferences} = user;

      return {
        props: {
          username,
          email,
          name,
          spotify_users,
          preferences,
          user_id: id,
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

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}

type ProfilePageProps = {
  user_id: number;
  email: string;
  username: string;
  name: string;
  spotify_users: {
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
  preferences: {
    id: number;
    top: boolean;
    account: boolean;
    current: boolean;
    recent: boolean;
    updated_at: string;
  };
};

const ProfilePage = ({...props}: ProfilePageProps) => {
  const [originalUser, setOriginalUser] = useState(props);
  const [user, setUser] = useState(props);

  const [hasSpotify, setHasSpotify] = useState(false);

  useEffect(() => {
    if (
      user.hasOwnProperty('spotify_users') &&
      user.spotify_users &&
      (user.spotify_users as any).id
    ) {
      setHasSpotify(true);
    }
  }, [user]);

  return (
    <Container maxW={'container.lg'}>
      {/* Card if user has no spotify account */}

      {!hasSpotify && <NoSpotifyAccountWarning />}

      <Tabs variant={'enclosed'}>
        <TabList>
          <Tab>Account</Tab>
          <Tab>Preferences</Tab>
          <Tab>Spotify Account</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProfileTab user={user} hasSpotify={hasSpotify} />
          </TabPanel>
          <TabPanel>
            <PreferencesSection user={user} />
          </TabPanel>
          <TabPanel>
            <SpotifyTab user={user} hasSpotify={hasSpotify} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

function NoSpotifyAccountWarning() {
  const router = useRouter();

  return (
    <Alert
      rounded={15}
      mb={10}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      textAlign={'center'}
      status={'error'}>
      <AlertIcon />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        No Spotify Account Linked
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        Hello there! 👋 For your profile to be visible and shareable, you need
        to link your Spotify account!
      </AlertDescription>

      <Button
        onClick={() => router.push('/link')}
        my={5}
        size={'sm'}
        leftIcon={<FaSpotify />}>
        Link Spotify Account
      </Button>
    </Alert>
  );
}

export function Header({title, lead}: {title: string; lead: string}) {
  return (
    <Box my={10}>
      <Heading>{title}</Heading>
      <Text>{lead}</Text>
    </Box>
  );
}

function ProfileTab({user, hasSpotify}: any) {
  return (
    <>
      <Header title="Account" lead="" />

      <form action="" method="">
        <Stack gap={10}>
          <FormControl>
            <FormLabel>Display Name</FormLabel>
            <Input
              name="display_name"
              type="text"
              value={decodeURI(user.name)}
              className="form-control"
              id="display_name"
              placeholder="Display Name"
              disabled
            />
          </FormControl>

          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              type="text"
              value={user.username}
              className="form-control"
              id="username"
              placeholder="Username"
              disabled
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={user.email}
              className="form-control"
              id="email"
              placeholder="Email"
              disabled
            />
          </FormControl>

          {hasSpotify && (
            <FormControl>
              <FormLabel>Musicn Profile Link</FormLabel>
              <Tooltip hasArrow label={'Click to Copy'}>
                <Input
                  name="musicn_link"
                  type="text"
                  value={`${window.location.origin}/@${user.username}`}
                  className="form-control"
                  id="musicn_link"
                  placeholder="Musicn Profile Link"
                  readOnly
                />
              </Tooltip>
            </FormControl>
          )}

          <Button type={'button'}>
            <Link href={'/profile/edit'}>Edit Profile</Link>
          </Button>
        </Stack>
      </form>
    </>
  );
}

function SpotifyTab({user, hasSpotify}: any) {
  return (
    <>
      <Header
        title="Spotify"
        lead="Check your Spotify data status. Re-link or un-link your Spotify account"
      />
      <div className="form-group">
        {hasSpotify && <StatusCheck user={user} />}
      </div>

      <div className="form-group">
        {hasSpotify && (
          <>
            <Text fontSize={'sm'} color={'gray.500'} mb={5}>
              Last linked:{' '}
              {DateTime.fromISO(user.spotify_users.updated_at).toRelative()}
            </Text>

            <HStack>
              <Button leftIcon={<FaSpotify />}>
                <Link href={`/api/link/spotify?redirect=/profile`}>
                  Re-link Spotify Account
                </Link>
              </Button>

              <Button leftIcon={<IoClose />}>
                <Link href={`/api/unlink/spotify?redirect=/profile`}>
                  Unlink Spotify Account
                </Link>
              </Button>
            </HStack>
          </>
        )}
      </div>

      {!hasSpotify && (
        <div className="form-group">
          <p>No Spotify Account Linked</p>
        </div>
      )}
    </>
  );
}

function StatusCheck({user}: any) {
  const {status: topStatus, refetch: topRefetch} = useQuery(
    ['topStatus', user],
    async () => await getTopSongsStatus(user.username),
    {
      refetchOnMount: true,
      enabled: false,
      retry: 2,
    },
  );

  const {status: recentStatus, refetch: recentRefetch} = useQuery(
    ['recentStatus', user],
    async () => await getRecentSongsStatus(user.username),
    {
      refetchOnMount: true,
      enabled: false,
      retry: 2,
    },
  );

  const {status: currentStatus, refetch: currentRefetch} = useQuery(
    ['currentStatus', user],
    async () => await getCurrentSongStatus(user.username),

    {enabled: false, retry: 2, refetchOnMount: true},
  );

  useEffect(() => {
    console.log('Refetch');
    // Fetch all statuses
    topRefetch();
    recentRefetch();
    currentRefetch();
  }, [topRefetch, recentRefetch, currentRefetch]);

  return (
    <Card p={5} rounded={15} my={5}>
      <Box mb={5}>
        <Heading as="h3" size="md" fontWeight="bold">
          Spotify Data Status
        </Heading>
        <Text color={'gray.400'} fontSize={'sm'}>
          If any of the statuses are red, please re-link your Spotify account.
        </Text>
      </Box>

      <Stack gap={2}>
        <HStack alignItems={'center'}>
          <StatusBadge status={currentStatus} />
          <Text>Currently Playing Track</Text>
        </HStack>

        <HStack alignItems={'center'}>
          <StatusBadge status={topStatus} />
          <Text>Top Songs</Text>
        </HStack>

        <HStack alignItems={'center'}>
          <StatusBadge status={recentStatus} />
          <Text>Recently Played Songs</Text>
        </HStack>
      </Stack>

      {
        //If any of these statuses is 'error', show the button to refetch
        (currentStatus === 'error' ||
          topStatus === 'error' ||
          recentStatus === 'error') && (
          <>
            <p>Please re-link your Spotify account</p>

            <motion.div
              className="w-fit"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.9,
              }}>
              <Link href={`/link`}>
                <FaSpotify size={15} />
                Link Spotify Account
              </Link>
            </motion.div>
          </>
        )
      }
    </Card>
  );
}

function StatusBadge({status}: {status: string}) {
  return (
    <Box
      w={2}
      h={2}
      bg={
        status === 'success'
          ? 'green.500'
          : status === 'loading'
          ? 'yellow.500'
          : 'red.500'
      }
      rounded={'full'}
    />
  );
}

export default ProfilePage;
