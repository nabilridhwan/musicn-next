import {FaSpotify} from 'react-icons/fa';
import Link from 'next/link';
import {IoEyeOutline} from 'react-icons/io5';
import {getUserByUsername_public} from '@/model/users';
import {Avatar, Button, Card, HStack, Stack, Text} from '@chakra-ui/react';

interface UserCardProps {
  username: string;
}

export default async function UserHeader({username}: UserCardProps) {
  const user = await getUserByUsername_public(username);

  return (
    <Card
      maxW={'fit-content'}
      p={5}
      rounded={'xl'}
      border={'1px solid'}
      borderColor={'whiteAlpha.300'}>
      <HStack gap={3}>
        <Avatar
          size={'lg'}
          src={user?.spotify_users?.profile_pic_url || undefined}
          name={user?.name || ''}
        />

        {/*User information*/}
        <Stack gap={0}>
          {/* Name */}
          <Text fontSize={'lg'} fontWeight={'bold'}>
            {decodeURI(user?.name || '')}
          </Text>

          {/* Username */}
          <Text color={'whiteAlpha.500'} fontSize={'sm'}>
            @{username}
          </Text>

          {/*<HStack gap={1} alignItems={'center'} color={'gray.600'} my={1}>*/}
          {/*    <IoEyeOutline size={10}/>*/}
          {/*    <Text fontSize={'xs'}>*/}
          {/*        {num_of_visitors} Visitors*/}
          {/*    </Text>*/}
          {/*</HStack>*/}

          {/* Spotify link */}
          {user?.spotify_users?.spotify_userid && (
            <Link
              href={`https://open.spotify.com/user/${user?.spotify_users?.spotify_userid}?go=1`}>
              <Button
                size={'sm'}
                bg={'green.500'}
                _hover={{bg: 'green.400'}}
                leftIcon={<FaSpotify />}>
                Spotify
              </Button>
            </Link>
          )}
        </Stack>
      </HStack>
    </Card>
  );
}
