import CenterStage from '@/components/CenterStage';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import getAllUsers from '@/frontend-api/user/getAllUsers';
import {motion} from 'framer-motion';
import absoluteUrl from 'next-absolute-url';
import Link from 'next/link';
import {FaSpotify} from 'react-icons/fa';
import {IoPerson, IoSearch} from 'react-icons/io5';
import {
    Avatar,
    Box,
    Button,
    Card,
    Container, FormControl, FormLabel,
    Grid,
    Heading,
    HStack, IconButton, Input, InputGroup, InputRightElement, SimpleGrid,
    Text,
    VStack,
} from '@chakra-ui/react';
import getColors from 'get-image-colors';
import {useEffect, useMemo, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import {Buffer} from 'buffer';
import {useRouter} from 'next/router';

type UsersProps = {
    users: any[];
};

export async function getServerSideProps(context: any) {
    const {origin} = absoluteUrl(context.req);
    const users = await getAllUsers();

    return {
        props: {
            users,
        },
    };
}

const Users = ({users}: UsersProps) => {
    console.log(users);
    return (
        <Container maxW={'container.lg'}>
            {/* Page header */}
            <Box my={10}>
                <Heading>Musicn Users</Heading>

                <p>All Musicn Users</p>

                {/*Search box*/}
                {/*<FormControl>*/}
                {/*    <FormLabel>*/}
                {/*        Search*/}
                {/*    </FormLabel>*/}

                {/*    <InputGroup rounded={15}>*/}
                {/*        <Input rounded={15} placeholder={"Search for a user"}/>*/}
                {/*        <InputRightElement>*/}
                {/*            <IconButton variant={"ghost"} aria-label={"Search"} icon={<IoSearch/>}/>*/}
                {/*        </InputRightElement>*/}
                {/*    </InputGroup>*/}
                {/*</FormControl>*/}
            </Box>


            <SimpleGrid columns={[1,2]} gap={6} data-test-id="users-list">
                {users.map(user => {
                    return (
                        <SearchUserCard
                            key={user.spotify_users.spotify_userid ?? user.username}
                            name={user.name}
                            username={user.username}
                            spotify_users={user.spotify_users}
                        />
                    );
                })}
            </SimpleGrid>
        </Container>
    );
};

interface UserCardProps {
    name: string;
    username: string;
    spotify_users?: {
        profile_pic_url: string;
        spotify_userid: string;
    };
}

const SearchUserCard = ({name, username, spotify_users}: UserCardProps) => {
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
            rounded={15}
            p={5}
            _hover={{
                scale: 1.5,
            }}
            cursor={'pointer'}
            onClick={() => {
                router.push(`/@${username}`);
            }}>
            {/* Profile Picture */}
            <Avatar size={'xl'} name={name} src={spotify_users?.profile_pic_url}/>

            <Heading order={2}>{decodeURI(name)}</Heading>

            {/*<Text color={"muted"}>*/}
            {/*    @{username}*/}
            {/*</Text>*/}
        </Card>
    );
};

export default Users;
