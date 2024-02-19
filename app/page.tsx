'use client';

import Link from 'next/link';
import {IoArrowForward} from 'react-icons/io5';
import Header from '../public/header.svg';
import Image from 'next/image';
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

const Home = () => {
  return (
    <>
      <Center>
        <Stack alignItems={'center'} gap={10}>
          <Box my={5}>
            <Image
              src={Header}
              height={300}
              alt={'Person listening to music with headphones on ear'}
            />
          </Box>

          <Stack alignItems={'center'}>
            <Heading>Share, Discover, and Connect with Musicn</Heading>

            <Text>
              Get a glimpse into the musical tastes of your friends and discover
              new tracks with Musicn!
            </Text>
          </Stack>

          <HStack>
            <Link href={'/api/login'}>
              <Button variant={'solid'} leftIcon={<IoArrowForward />}>
                Get Started
              </Button>
            </Link>

            <Link href={'/api/login'}>
              <Button variant={'ghost'}>Already have an account? Log in</Button>
            </Link>
          </HStack>

          {/*TODO: Redirect to Changelog*/}
          {/*<p className={'my-10'}>*/}
          {/*  Musicn comes back with a new look in v0.8.0 🤩! Read more{' '}*/}
          {/*  <Link href={'/changelog/v0-8-0'}>here!</Link>*/}
          {/*</p>*/}

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
        </Stack>
      </Center>
    </>
  );
};

export default Home;
