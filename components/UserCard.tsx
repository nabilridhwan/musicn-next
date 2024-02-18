'use client';
import {useRouter} from 'next/navigation';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      className={'cursor-pointer'}>
      <div className={'p-4'}>
        <div className={'flex gap-2'}>
          <Avatar>
            <AvatarImage src={spotify_users?.profile_pic_url || undefined} />
            <AvatarFallback className={'bg-red-800 font-bold'}>
              {name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className={'gap-0'}>
            <p className={'font-bold text-lg'}>{decodeURI(name)}</p>
            <p className={'text-sm text-white/50'}>@{username}</p>
          </div>
        </div>
        {/*<Text fontSize={'xs'}>{num_of_visitors} Visitors</Text>*/}

        {/*<Text color={"muted"}>*/}
        {/*    @{username}*/}
        {/*</Text>*/}
      </div>
    </Card>
  );
};

export default UserCard;
