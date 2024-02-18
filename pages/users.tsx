import CenterStage from '@/components/CenterStage';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import getAllUsers from '@/services/user/getAllUsers';
import {motion} from 'framer-motion';
import absoluteUrl from 'next-absolute-url';
import Link from 'next/link';
import {FaSpotify} from 'react-icons/fa';
import {IoPerson, IoSearch} from 'react-icons/io5';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import getColors from 'get-image-colors';
import {useEffect, useMemo, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import {Buffer} from 'buffer';
import {useRouter} from 'next/router';
import {NextRequest} from 'next/server';
import {NextPageContext} from 'next';

type UsersProps = {
  users: any[];
  query?: string;
};

export async function getServerSideProps(context: NextPageContext) {
  const {origin} = absoluteUrl(context.req);

  const query = (context.query.q as string | undefined) || '';

  const users = await getAllUsers({query});

  return {
    props: {
      users,
      query,
    },
  };
}

const Users = ({users, query = ''}: UsersProps) => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(query);

  return (
    <Container maxW={'container.lg'}>
      {/* Page header */}
      <Stack my={10} gap={3}>
        <Heading>Musicn Users</Heading>

        <p>All Musicn Users</p>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={IoSearch} color={'whiteAlpha.500'} />
          </InputLeftElement>

          <Input
            placeholder={'Search for a user'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                window.location.href = `/users?q=${searchQuery}`;
              }
            }}
          />
        </InputGroup>

        {/*Search box*/}
        {/*<FormControl>*/}
        {/*    <FormLabel>*/}
        {/*        Search*/}
        {/*    </FormLabel>*/}

        {/*    <InputGroup rounded={15}>*/}
        {/*        <Input rounded={15} placeholder={"Search for a user"}/>*/}
        {/*        <InputRightElement>*/}
        {/*            <IconButton variant={"ghost"} aria-label={"Search"} icon={<IoSearch/>}/>*/}
        {/*        </InputRightElement>*/}
        {/*    </InputGroup>*/}
        {/*</FormControl>*/}
      </Stack>

      <SimpleGrid columns={[1, 2]} gap={6} data-test-id="users-list">
        {users.map(user => {
          return (
            <SearchUserCard
              key={user.spotify_users.spotify_userid ?? user.username}
              name={user.name}
              username={user.username}
              spotify_users={user.spotify_users}
              num_of_visitors={user.num_of_visitors}
            />
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

interface UserCardProps {
  name: string;
  username: string;
  num_of_visitors: number;
  spotify_users?: {
    profile_pic_url: string;
    spotify_userid: string;
  };
}

const SearchUserCard = ({
  name,
  username,
  spotify_users,
  num_of_visitors,
}: UserCardProps) => {
  const router = useRouter();

  // const [color, setColor] = useState<string | null>(null);
  //
  // useEffect(() => {
  //     (async () => {
  //         if (!spotify_users) return;
  //
  //         // Fetch user image
  //         const profPicData = await axios.get(spotify_users.profile_pic_url, {
  //             responseType: 'blob',
  //         })
  //
  //
  //         const c = await getColors(
  //             spotify_users.profile_pic_url, {
  //                 count: 1
  //             }
  //         )
  //
  //         const hex = c[0].alpha(0.6).hex() || null;
  //         setColor(hex)
  //     })();
  // }, [spotify_users])

  return (
    <Card
      rounded={15}
      p={5}
      _hover={{
        scale: 1.5,
      }}
      cursor={'pointer'}
      onClick={() => {
        router.push(`/@${username}`);
      }}>
      {/* Profile Picture */}

      <HStack gap={5}>
        <Avatar size={'lg'} name={name} src={spotify_users?.profile_pic_url} />

        <Stack gap={0}>
          <Text fontWeight={'bold'} fontSize={'lg'}>
            {decodeURI(name)}
          </Text>
          <Text fontSize={'sm'} color={'gray.400'}>
            @{username}
          </Text>
          {/*<Text fontSize={'xs'}>{num_of_visitors} Visitors</Text>*/}
        </Stack>
      </HStack>

      {/*<Text color={"muted"}>*/}
      {/*    @{username}*/}
      {/*</Text>*/}
    </Card>
  );
};

export default Users;
