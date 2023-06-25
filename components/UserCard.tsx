import {Avatar, Button, Heading, HStack, Text} from '@chakra-ui/react';
import {FaSpotify} from 'react-icons/fa';
import Link from 'next/link';

interface UserCardProps {
  username: string;
  display_name: string;
  profile_pic_url?: string;
  spotify_userid?: string;
}

export default function UserCard({
  username,
  display_name,
  spotify_userid,
  profile_pic_url,
}: UserCardProps) {
  return (
    <HStack gap={5}>
      <Avatar size={'xl'} src={profile_pic_url} name={display_name} />

      <div>
        {/* Name */}
        <Heading size={'md'}>{decodeURI(display_name)}</Heading>

        {/* Username */}
        <Text fontSize={'sm'}>@{username}</Text>

        {/* Spotify link */}
        {spotify_userid && (
          <Button my={3} size={'sm'} leftIcon={<FaSpotify />}>
            <Link href={`https://open.spotify.com/user/${spotify_userid}?go=1`}>
              Spotify
            </Link>
          </Button>
        )}
      </div>
    </HStack>
  );
}
