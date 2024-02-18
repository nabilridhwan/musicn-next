import type {Metadata, NextPage} from 'next';
import Link from 'next/link';
import {IoArrowForward} from 'react-icons/io5';
import Header from '../public/header.svg';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {redirect} from 'next/navigation';

const Home: NextPage = () => {
  return (
    <>
      <div>
        <div className={'my-5'}>
          <Image
            src={Header}
            height={300}
            alt={'Person listening to music with headphones on ear'}
          />
        </div>

        <h1>Share, Discover, and Connect with Musicn</h1>

        <p>
          Get a glimpse into the musical tastes of your friends and discover new
          tracks with Musicn!
        </p>

        <Link href={'/api/login'}>
          <Button>
            <IoArrowForward />
            Get Started
          </Button>
        </Link>

        <Link href={'/api/login'}>
          <Button variant={'ghost'} size={'sm'}>
            Already have an account? Log in
          </Button>
        </Link>

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
      </div>
    </>
  );
};

export default Home;
