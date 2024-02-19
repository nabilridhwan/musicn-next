import Link from 'next/link';
import useUserSignedIn from '@/hooks/useUserSignedIn';
import {LoggedInNavigationItems} from '@/components/LoggedInNavigationItems';
import {getMe} from '@/api/getMe';
import {Button, Container, HStack, Spacer} from '@chakra-ui/react';
import {Space} from 'lucide-react';

const NavigationBar = async () => {
  const isUserSignedIn = useUserSignedIn();
  const profile = await getMe();

  return (
    <Container maxW={'6xl'} px={10} py={3}>
      <HStack>
        <Link href="/">Home</Link>
        <Link href="/users">Users</Link>

        <Spacer />

        {/*<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />*/}

        {isUserSignedIn ? (
          <LoggedInNavigationItems profile={profile} />
        ) : (
          <>
            <Link href={'/api/login'}>
              <Button>Login / Signup</Button>
            </Link>
          </>
        )}
      </HStack>
    </Container>
  );
};

// interface SearchBarInterface {
//   searchQuery: string | null;
//   setSearchQuery: (query: string | null) => void;
// }
//
// function SearchBar({searchQuery = '', setSearchQuery}: SearchBarInterface) {
//   const {data: userData, isLoading: userDataLoading} = useQuery<
//     Array<{
//       name: string;
//       num_of_visitors: number;
//       spotify_users?: {
//         profile_pic_url: string;
//         spotify_userid: string;
//         name: string;
//       };
//       username: string;
//     }>
//   >(
//     ['search', searchQuery],
//     async () => {
//       return await getAllUsers({query: searchQuery || ''});
//     },
//     {
//       enabled: !!searchQuery && searchQuery.trim().length > 0,
//     },
//   );
//
//   const users = userData || [];
//
//   return (
//     <Box>
//       {/*Search*/}
//       <form action={'/users'}>
//         <Box position={'relative'}>
//           <InputGroup>
//             <Input
//               value={searchQuery || ''}
//               onChange={e => {
//                 setSearchQuery(e.target.value);
//               }}
//               placeholder="Search for users"
//               name={'q'}
//             />
//
//             <InputRightElement>
//               <IconButton
//                 aria-label={'Search'}
//                 type={'submit'}
//                 icon={<IoSearch />}
//               />
//             </InputRightElement>
//           </InputGroup>
//
//           {/*Search results*/}
//           <Stack
//             gap={'xs'}
//             px={3}
//             mt={2}
//             zIndex={10}
//             position={'absolute'}
//             w={'100%'}
//             bg={'gray.800'}
//             borderRadius={10}
//             shadow={'lg'}>
//             {(searchQuery ?? '').trim().length > 0 && userDataLoading && (
//               <Center my={3}>
//                 <LoadingSpinner height={20} />
//               </Center>
//             )}
//
//             {users.map((user, idx) => (
//               <SearchResultCard
//                 key={user.username + '_' + idx}
//                 avatar={''}
//                 name={user.name}
//                 username={user.username}
//               />
//             ))}
//           </Stack>
//         </Box>
//       </form>
//     </Box>
//   );
// }
//
// interface SearchResultCardProps {
//   avatar: string;
//   name: string;
//   username: string;
// }
//
// function SearchResultCard({avatar, name, username}: SearchResultCardProps) {
//   return (
//     <Card p={3}>
//       <HStack gap={2}>
//         <Avatar size={'sm'} src={avatar} name={name} />
//
//         <Stack gap={0}>
//           <Text>{name}</Text>
//           <Text color={'gray.400'} fontSize={'xs'} maxW={'100%'} noOfLines={1}>
//             @{username}
//           </Text>
//         </Stack>
//       </HStack>
//     </Card>
//   );
// }

export default NavigationBar;
