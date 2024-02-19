'use client';
import {useRouter} from 'next/navigation';
import {Avatar, Box, Card, HStack, Text} from '@chakra-ui/react';

interface UserCardProps {
  name: string;
  username: string;
  num_of_visitors: number;
  spotify_users?: {
    profile_pic_url: string | null;
    spotify_userid: string;
  };
}

const UserCard = ({
  name,
  username,
  spotify_users,
  num_of_visitors = 0,
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
      role={'button'}
      onClick={() => {
        router.push(`/@${username}`);
      }}
      cursor={'pointer'}
      p={2}
      dropShadow={'none'}
      shadow={'none'}
      border={'1px solid'}
      borderColor={'whiteAlpha.300'}>
      <HStack>
        <Avatar
          src={spotify_users?.profile_pic_url || undefined}
          name={name.slice(0, 1).toUpperCase()}
        />

        <Box>
          <Text fontWeight={'bold'}>{decodeURI(name)}</Text>
          <Text color={'whiteAlpha.500'} fontSize={'sm'}>
            @{username}
          </Text>
        </Box>
      </HStack>
      {/*<Text fontSize={'xs'}>{num_of_visitors} Visitors</Text>*/}

      {/*<Text color={"muted"}>*/}
      {/*    @{username}*/}
      {/*</Text>*/}
    </Card>
  );
};

export default UserCard;
