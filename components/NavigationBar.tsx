import {getCookie} from 'cookies-next';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {
  IoChevronDown,
  IoCogOutline,
  IoExitOutline,
  IoGrid,
  IoHomeOutline,
  IoMenuOutline,
  IoPeopleOutline,
} from 'react-icons/io5';
import {
  Avatar,
  Button,
  Container,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import useUserSignedIn from '@/hooks/useUserSignedIn';
import {useQuery} from '@tanstack/react-query';
import getOwnProfile from '@/frontend-api/me/getOwnProfile';
import {STATIC_PROPS_ID} from 'next/constants';

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
  const [isUserSignedIn] = useUserSignedIn();

  return (
    <Container maxW={'container.xl'} my={8}>
      <Flex>
        <HStack flex={1}>

          <Link href="/">
            Home
          </Link>

          <Link href="/users">
            Users
          </Link>
        </HStack>

        <HStack justifyContent={'flex-end'} gap={5}>
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

export default NavigationBar;
