import {FaSpotify} from 'react-icons/fa';
import Link from 'next/link';
import {IoEyeOutline} from 'react-icons/io5';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';

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
    <div className={'border flex items-center gap-2 w-fit p-5 rounded-2xl'}>
      <Avatar>
        <AvatarImage src={profile_pic_url} />
        <AvatarFallback>{display_name}</AvatarFallback>
      </Avatar>

      {/*User information*/}
      <div>
        {/* Name */}
        <h1 className={'text-lg bold'}>{decodeURI(display_name)}</h1>

        {/* Username */}
        <p className={'text-sm opacity-70'}>@{username}</p>

        {/*<HStack gap={1} alignItems={'center'} color={'gray.600'} my={1}>*/}
        {/*    <IoEyeOutline size={10}/>*/}
        {/*    <Text fontSize={'xs'}>*/}
        {/*        {num_of_visitors} Visitors*/}
        {/*    </Text>*/}
        {/*</HStack>*/}

        {/* Spotify link */}
        {spotify_userid && (
          <Link href={`https://open.spotify.com/user/${spotify_userid}?go=1`}>
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
