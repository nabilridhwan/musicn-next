import CenterStage from '@/components/CenterStage';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import {getUserById} from '@/model/users';
import APITokenHandler from '@/util/APITokenHandler';
import {getCookie} from 'cookies-next';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {FaSpotify} from 'react-icons/fa';
import {IoPerson} from 'react-icons/io5';
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';

export async function getServerSideProps(context: any) {
  const token = getCookie('token', {req: context.req, res: context.res});

  if (token) {
    const {user_id} = APITokenHandler.extractDataFromToken(
      token as string,
    ) as TokenData;

    const {name, username, spotify_users} = await getUserById(user_id);

    if (spotify_users && spotify_users.id) {
      return {
        redirect: {
          destination: '/profile',
          permanent: false,
        },
      };
    }

    return {
      props: {
        name,
        username,
      },
    };
  }

  return {
    redirect: {
      destination: '/users',
      permanent: false,
    },
  };
}

const LinkPage = ({name, username}: {[prop: string]: any}) => {
  const router = useRouter();

  return (
    <Container maxW={'container.md'}>
      {/* Page header */}
      <Box my={10}>
        <Heading>Hello {name}!</Heading>

        <Text>
          Link your Spotify account to use Musicn&apos;s features and make your
          account visible (and shareable!)
        </Text>

        <Divider my={5} />

        <Text as={'i'} fontSize={'sm'}>
          You can unlink your Spotify account at any time from the profile page.
          Your Musicn account will still be active but hidden.
        </Text>
      </Box>

      <HStack gap={3}>
        <Button
          leftIcon={<FaSpotify />}
          onClick={() => router.push(`/api/link/spotify?redirect=/profile`)}>
          Link Spotify Account
        </Button>

        <Button variant={'ghost'} onClick={() => router.push(`/profile`)}>
          I&apos;ll do it later
        </Button>
      </HStack>
    </Container>
  );
};

export default LinkPage;
