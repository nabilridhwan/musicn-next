import type {Metadata, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {IoArrowForward} from 'react-icons/io5';
import {
    Box,
    Button,
    Center,
    Heading,
    Text,
    VStack,
} from '@chakra-ui/react';
import Header from '../public/header.svg';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Musicn - Discover what other people are listening to',
}

const Home: NextPage = () => {
    return (
        <>
            <Center textAlign={'center'}>
                <VStack>
                    <Box my={5}>
                        <Image
                            src={Header}
                            height={300}
                            alt={'Person listening to music with headphones on ear'}
                        />
                    </Box>

                    <Heading>Share, Discover, and Connect with Musicn</Heading>

                    <Text>
                        Get a glimpse into the musical tastes of your friends and
                        discover new tracks with Musicn!
                    </Text>

                    {/*TODO: Redirect to /signup*/}
                    <Button rightIcon={<IoArrowForward />} mt={5}>
                        <Link href={'/signup'}>Get started</Link>
                    </Button>

                    {/*TODO: Redirect to Changelog*/}
                    <Text my={10}>
                        Musicn comes back with a new look in v0.8.0 🤩! Read more{' '}
                        <Link href={'/changelog/v0-8-0'}>here!</Link>
                    </Text>

                    {/*<Box bg={'red.500'} borderRadius={15} w={900}>*/}
                    {/*    <img src={"/promo.png"} alt={"Musicn Promo Image"} />*/}
                    {/*</Box>*/}

                    {/*<HStack my={10}>*/}
                    {/*    <Button variant={"ghost"} size={"sm"}>*/}
                    {/*        What&apos;s new? ✨*/}
                    {/*    </Button>*/}

                    {/*    <Button variant={"ghost"} size={"sm"}>*/}
                    {/*        Read: Some words from me*/}
                    {/*    </Button>*/}
                    {/*</HStack>*/}
                </VStack>
            </Center>

        </>
    );
};

export default Home;
