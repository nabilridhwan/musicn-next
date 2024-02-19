'use client';

import Link from 'next/link';
import {IoArrowForward} from 'react-icons/io5';
import Header from '../public/header.svg';
import Image from 'next/image';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

const Home = () => {
  return (
    <Container maxW={'6xl'} px={5}>
      <Stack alignItems={'center'} gap={10} textAlign={'center'}>
        <Box my={5}>
          <Image
            src={Header}
            height={200}
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

        <Stack alignItems={'center'}>
          <Link href={'/api/login'}>
            <Button variant={'solid'} leftIcon={<IoArrowForward />}>
              Get Started
            </Button>
          </Link>

          <Link href={'/api/login'}>
            <Button variant={'ghost'}>Already have an account? Log in</Button>
          </Link>
        </Stack>

        <SimpleGrid columns={[1, 2]} gap={5}>
          <Box
            maxW={'fit-content'}
            bg={'gray.700'}
            p={5}
            rounded={'2xl'}
            justifyContent={'center'}
            display={'flex'}
            alignItems={'center'}>
            <Stack gap={2}>
              <Text fontWeight={'bold'} fontSize={'lg'}>
                What&apos;s new in Musicn v0.9.0? 🚀
              </Text>
              <Text>
                Musicn is now turbocharged with Next.js 14, making it faster and
                elevating your user experience. React Server Components ensure
                lightning-fast response times. Same vibe, upgraded engine –
                enjoy the speed!
              </Text>
            </Stack>
          </Box>

          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            py={5}
            mx={'auto'}
            rounded={'2xl'}>
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Spotify accounts are now the only way to log in/sign up
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              As of February 19, 2024, Musicn now requires logging in/signing up
              through Spotify accounts. Email/password login is no longer
              available. Your Musicn account is tied to your Spotify account,
              and unlinking is not possible. Existing users will be redirected
              to Spotify to log in. Your account data remain untouched.
            </AlertDescription>
          </Alert>
        </SimpleGrid>

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
    </Container>
  );
};

export default Home;
