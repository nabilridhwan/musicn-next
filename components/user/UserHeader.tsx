import {FaSpotify} from 'react-icons/fa';
import Link from 'next/link';
import {IoEyeOutline} from 'react-icons/io5';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {getUserByUsername_public} from '@/model/users';

interface UserCardProps {
  username: string;
}

export default async function UserHeader({username}: UserCardProps) {
  const user = await getUserByUsername_public(username);

  return (
    <div className={'border flex items-center gap-2 w-fit p-5 rounded-2xl'}>
      <Avatar>
        <AvatarImage src={user?.spotify_users?.profile_pic_url || undefined} />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>

      {/*User information*/}
      <div>
        {/* Name */}
        <h1 className={'text-lg bold'}>{decodeURI(user?.name || '')}</h1>

        {/* Username */}
        <p className={'text-sm opacity-70'}>@{username}</p>

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
            <Button size={'sm'}>
              <FaSpotify size={20} className={'mr-2'} />
              Spotify
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
