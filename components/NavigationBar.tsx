import {getCookie} from 'cookies-next';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {SetStateAction, useEffect, useMemo, useState} from 'react';
import {
  IoChevronDown,
  IoCogOutline,
  IoExitOutline,
  IoGrid,
  IoHomeOutline,
  IoMenuOutline,
  IoPeopleOutline,
  IoSearch,
} from 'react-icons/io5';
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import useUserSignedIn from '@/hooks/useUserSignedIn';
import {useQuery} from '@tanstack/react-query';
import getOwnProfile from '@/services/me/getOwnProfile';
import {STATIC_PROPS_ID} from 'next/constants';
import {useRouter} from 'next/router';
import {IconBase} from 'react-icons';
import getAllUsers from '@/services/user/getAllUsers';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoggedInNavigationItems = () => {
  const {data: profile, isLoading: profileLoading} = useQuery(
    ['me'],
    async () => await getOwnProfile(),
    {
      cacheTime: 30000,
    },
  );

  if (profileLoading) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        variant={'link'}
        as={Button}
        rounded={'full'}
        w={'fit-content'}>
        <HStack>
          <Avatar
            size={'xs'}
            name={profile?.name}
            src={profile?.spotify_users?.profile_pic_url}
          />

          <Text fontSize={'sm'}>{profile?.name}</Text>
        </HStack>
      </MenuButton>

      <MenuList>
        <MenuItem>
          <Link href={'/profile'}>Account Settings</Link>
        </MenuItem>

        <MenuItem>
          <Link href={`/@${profile?.username}`}>Musicn Profile</Link>
        </MenuItem>

        {/*<MenuItem>*/}
        {/*  <Link href={'/gridify'}>Gridify</Link>*/}
        {/*</MenuItem>*/}

        <MenuDivider />

        <MenuItem>
          <Link href={'/api/logout'}>Logout</Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const NavigationBar = () => {
  const router = useRouter();

  const [isUserSignedIn] = useUserSignedIn();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    (router.query.q as string) || null,
  );

  return (
    <Container maxW={'container.xl'} my={8}>
      <Flex>
        <HStack gap={5}>
          <Link href="/">Home</Link>

          <Link href="/users">Users</Link>
        </HStack>

        <Spacer />

        <HStack justifyContent={'flex-end'} gap={5}>
          {/*<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />*/}
          {isUserSignedIn ? (
            <LoggedInNavigationItems />
          ) : (
            <>
              <Button>
                <Link href={'/login'}>Login</Link>
              </Button>

              <Link href="/signup">Signup</Link>
            </>
          )}
        </HStack>
      </Flex>
    </Container>
  );
};

interface SearchBarInterface {
  searchQuery: string | null;
  setSearchQuery: (query: string | null) => void;
}

function SearchBar({searchQuery = '', setSearchQuery}: SearchBarInterface) {
  const {data: userData, isLoading: userDataLoading} = useQuery<
    Array<{
      name: string;
      num_of_visitors: number;
      spotify_users?: {
        profile_pic_url: string;
        spotify_userid: string;
        name: string;
      };
      username: string;
    }>
  >(
    ['search', searchQuery],
    async () => {
      return await getAllUsers({query: searchQuery || ''});
    },
    {
      enabled: !!searchQuery && searchQuery.trim().length > 0,
    },
  );

  const users = useMemo(() => {
    if (!userData) return [];
    return userData;
  }, [userData]);

  return (
    <Box>
      {/*Search*/}
      <form action={'/users'}>
        <Box position={'relative'}>
          <InputGroup>
            <Input
              value={searchQuery || ''}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search for users"
              name={'q'}
            />

            <InputRightElement>
              <IconButton
                aria-label={'Search'}
                type={'submit'}
                icon={<IoSearch />}
              />
            </InputRightElement>
          </InputGroup>

          {/*Search results*/}
          <Stack
            gap={'xs'}
            px={3}
            mt={2}
            zIndex={10}
            position={'absolute'}
            w={'100%'}
            bg={'gray.800'}
            borderRadius={10}
            shadow={'lg'}>
            {(searchQuery ?? '').trim().length > 0 && userDataLoading && (
              <Center my={3}>
                <LoadingSpinner height={20} />
              </Center>
            )}

            {users.map((user, idx) => (
              <SearchResultCard
                key={user.username + '_' + idx}
                avatar={''}
                name={user.name}
                username={user.username}
              />
            ))}
          </Stack>
        </Box>
      </form>
    </Box>
  );
}

interface SearchResultCardProps {
  avatar: string;
  name: string;
  username: string;
}

function SearchResultCard({avatar, name, username}: SearchResultCardProps) {
  return (
    <Card p={3}>
      <HStack gap={2}>
        <Avatar size={'sm'} src={avatar} name={name} />

        <Stack gap={0}>
          <Text>{name}</Text>
          <Text color={'gray.400'} fontSize={'xs'} maxW={'100%'} noOfLines={1}>
            @{username}
          </Text>
        </Stack>
      </HStack>
    </Card>
  );
}

export default NavigationBar;
