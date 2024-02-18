import {Avatar, Button, Heading, HStack, Icon, Text} from '@chakra-ui/react';
import {FaSpotify} from 'react-icons/fa';
import Link from 'next/link';
import {IoEyeOutline} from 'react-icons/io5';

interface UserCardProps {
  username: string;
  display_name: string;
  profile_pic_url?: string;
  spotify_userid?: string;
  num_of_visitors?: number;
}

export default function UserHeader({
  username,
  display_name,
  spotify_userid,
  profile_pic_url,
  num_of_visitors,
}: UserCardProps) {
  return (
    <HStack gap={10}>
      <div>
        {/* Name */}
        <Heading size={'lg'}>{decodeURI(display_name)}</Heading>

        {/* Username */}
        <Text color={'gray.500'} fontSize={'sm'}>
          @{username}
        </Text>

        {/*<HStack gap={1} alignItems={'center'} color={'gray.600'} my={1}>*/}
        {/*    <IoEyeOutline size={10}/>*/}
        {/*    <Text fontSize={'xs'}>*/}
        {/*        {num_of_visitors} Visitors*/}
        {/*    </Text>*/}
        {/*</HStack>*/}

        {/* Spotify link */}
        {spotify_userid && (
          <Button my={3} size={'sm'} leftIcon={<FaSpotify />}>
            <Link href={`https://open.spotify.com/user/${spotify_userid}?go=1`}>
              Spotify
            </Link>
          </Button>
        )}
      </div>

      <Avatar
        size={'xl'}
        borderRadius={4}
        src={profile_pic_url}
        name={display_name}
      />
    </HStack>
  );
}
