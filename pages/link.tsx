import CenterStage from '@/components/CenterStage';
import Container from '@/components/Container';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import Section from '@/components/Section';
import {getUserById} from '@/model/users';
import APITokenHandler from '@/util/APITokenHandler';
import {getCookie} from 'cookies-next';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {FaSpotify} from 'react-icons/fa';
import {IoPerson} from 'react-icons/io5';

export async function getServerSideProps(context: any) {
  const token = getCookie('token', {req: context.req, res: context.res});

  if (token) {
    const {user_id} = APITokenHandler.extractDataFromToken(
      token as string,
    ) as TokenData;

    const {name, username, spotify_users} = await getUserById(user_id);

    if (spotify_users && spotify_users.id) {
      return {
        redirect: {
          destination: '/profile',
          permanent: false,
        },
      };
    }

    return {
      props: {
        name,
        username,
      },
    };
  }

  return {
    redirect: {
      destination: '/users',
      permanent: false,
    },
  };
}

const LinkPage = ({name, username}: {[prop: string]: any}) => {
  return (
    <Container>
      <CenterStage>
        <Section>
          <div className="flex flex-col text-center items-center justify-center">
            {/* Page header */}
            <header className="my-10">
              <h1>Hello {name}!</h1>
              <p className="muted">
                Link your Spotify account to use Musicn&apos;s features and make
                your account visible (and shareable!)
              </p>
            </header>

            {/* Profile example */}

            <p className="my-1">Like this:</p>
            <div className="my-10 border border-white/20 break-all p-5 rounded-xl flex flex-col items-center text-center lg:text-left lg:flex-row gap-5 ">
              {/* Profile Picture */}
              <div className="col-span-1">
                <DefaultProfilePicture />
              </div>

              {/* Content */}
              <div className="col-span-3">
                <h2 className="text-2xl font-bold">{decodeURI(name)}</h2>
                <p className={'text-sm text-white/20'}>@{username}</p>

                <div className="flex flex-wrap gap-2 items-center justify-center">
                  {/* <p>
											Spotify name:{' '}
											{user.spotify_users.name}
										</p>
										<p>
											Spotify user id:{' '}
											{user.spotify_users.spotify_userid}
										</p> */}

                  {/* Profile Button */}
                  <motion.div
                    className="w-fit"
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}>
                    <a className="bg-white text-black shadow-[0px_0px_20px] shadow-white/20 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
                      <IoPerson size={16} />
                      Profile
                    </a>
                  </motion.div>

                  <motion.div
                    className="w-fit"
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}>
                    <a className="bg-spotify shadow-[0px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
                      <FaSpotify size={16} />
                      Spotify
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div
              className="w-fit"
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.9,
              }}>
              <Link href={`/api/link/spotify?redirect=/profile`}>
                <a className="bg-spotify shadow-[-1px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit flex items-center gap-2">
                  <FaSpotify size={15} />
                  Link Spotify Account
                </a>
              </Link>
            </motion.div>

            <Link href={'/users'}>
              <a className="mt-10 text-sm muted underline">
                I&apos;ll do it later
              </a>
            </Link>
          </div>
        </Section>
      </CenterStage>
    </Container>
  );
};

export default LinkPage;
