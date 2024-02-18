import CenterStage from '@/components/CenterStage';
import LoadingSpinner from '@/components/LoadingSpinner';
import Section from '@/components/Section';
import getTopSongs from '@/services/song/getTopSongs';
import getUserDetails from '@/services/user/getUserDetails';
import {getUserById} from '@/model/users';
import APITokenHandler from '@/util/APITokenHandler';
import axios, {AxiosError} from 'axios';
import chroma from 'chroma-js';
import {getCookie} from 'cookies-next';
import domtoimage from 'dom-to-image';
import getColors from 'get-image-colors';
import {DateTime} from 'luxon';
import Head from 'next/head';
import {Ref, useEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {IoDownloadOutline} from 'react-icons/io5';
import Container from '../../components/Container';
import {encode} from './error';

type UsersProps = {
  user: any;
  top: any;
  played: any;
};

export type GridifyErrorResponse = {
  error: string;
  errorMessage: string;
  linkPlaceholder: string;
  link: string;
};

export async function getServerSideProps(context: any) {
  const token = getCookie('token', {req: context.req, res: context.res});

  try {
    const {user_id} = APITokenHandler.extractDataFromToken(
      token as string,
    ) as TokenData;

    console.log(user_id);

    const {username} = await getUserById(user_id);

    let [user, top] = await axios.all([
      getUserDetails(username),
      getTopSongs(username),
      // getStatisticsPlayed(username),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.spotify_users) {
      throw new Error('No spotify user found');
    }

    if (user.preferences.account === false) {
      throw new Error('Account is not visible to the public');
    }

    if (user.preferences.top === false) {
      throw new Error('Top songs are private');
    }

    if (top.length > 0) {
      const topPromises = top.map(async (song: any) => {
        const colors = await getColors(song.album_art);

        return {
          ...song,
          color: colors[2].alpha(0.6).hex() || null,
        };
      });

      const values = await Promise.all(topPromises);
      top = values;
    }

    return {
      props: {
        user: user,
        top,
        // played,
      },
    };
  } catch (error: any) {
    console.log(error);

    if (error instanceof AxiosError) {
      const error: GridifyErrorResponse = {
        error: 'No Spotify user found',
        errorMessage:
          'Please connect your Spotify account to your Musicn account to use Gridify',
        linkPlaceholder: 'Link account',
        link: '/link',
      };
      return {
        redirect: {
          destination: '/gridify/error?error=' + encode(error),
          permanent: false,
        },
      };
    }

    if (
      error.message === 'Account is not visible to the public' ||
      error.message === 'Top songs are private'
    ) {
      const error: GridifyErrorResponse = {
        error: 'Invalid permissions',
        errorMessage:
          "Your account has limited permissions and we can't generate your gridify. Make sure you set your account to public and your top songs to public in preferences.",
        linkPlaceholder: 'Change preferences',
        link: '/profile',
      };

      return {
        redirect: {
          destination: `/gridify/error?error=${encode(error)}`,
          permanent: false,
        },
      };
    }

    const defaultError: GridifyErrorResponse = {
      error: 'You do not have a Musicn account',
      errorMessage:
        "Please create a Musicn account to use Gridify. It's free and only takes a minute.",
      linkPlaceholder: 'Sign Up',
      link: '/signup',
    };
    return {
      redirect: {
        destination: `/gridify/error?error=${encode(defaultError)}`,
        permanent: false,
      },
    };
  }
}

const GridifyHome = ({user, top: topFromServer, played}: UsersProps) => {
  const saveItemRef = useRef(null);

  const [top, setTop] = useState(topFromServer);

  const [showCanvas, setShowCanvas] = useState(false);

  const [fetchImageDone, setFetchImageDone] = useState(false);

  // Fetch all images using axios and set it back to top
  useEffect(() => {
    (async () => {
      const topPromises = top.map(async (song: any) => {
        const album_art_base64 = await axios
          .get(song.album_art, {
            responseType: 'arraybuffer',
          })
          .then(response =>
            Buffer.from(response.data, 'binary').toString('base64'),
          );

        return {
          ...song,
          album_art_base64,
        };
      });

      const values = await Promise.all(topPromises);
      console.log(values);
      setTop(values);
      setFetchImageDone(true);
    })();
  }, []);

  const handleDownloadImage = async () => {
    // Force re-render and overcome automatic setState batching (Read more here: https://blog.bitsrc.io/automatic-batching-in-react-18-what-you-should-know-d50141dc096e)
    flushSync(() => {
      setShowCanvas(true);
    });

    const element = saveItemRef.current;
    if (element) {
      const h = 1500;
      const w = (h / 16) * 9;
      domtoimage
        .toPng(element, {quality: 3, width: w, height: h})
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = `gridify-${
            user.username
          }-${DateTime.now().toISODate()}.png`;
          link.href = dataUrl;
          link.click();

          setShowCanvas(false);
        })
        .catch(e => console.log(e));
    }
  };

  return (
    <>
      <Head>
        <title>Gridify</title>

        <meta
          name="description"
          content="Show your top songs as a grid!"></meta>
      </Head>

      <div className="overflow-clip max-h-full">
        <Container>
          <CenterStage>
            <Section>
              <div className="text-center flex flex-col items-center justify-center my-10">
                <h1>Your Gridify is ready!</h1>
                <p className="muted">
                  Hi {user.name}! Click &apos;Save&apos; to save your Gridify
                </p>
                <button
                  onClick={handleDownloadImage}
                  className="btn btn-primary"
                  disabled={!fetchImageDone}>
                  {!fetchImageDone || showCanvas ? (
                    <LoadingSpinner color="black" width={20} height={20} />
                  ) : (
                    <p className="flex items-center gap-2 text-lg">
                      <IoDownloadOutline />
                      Save
                    </p>
                  )}
                </button>
              </div>
            </Section>
          </CenterStage>
        </Container>

        {showCanvas && (
          <Canvas itemRef={saveItemRef} user={user} top={top} played={played} />
        )}
      </div>
    </>
  );
};

function Canvas({
  itemRef,
  user,
  top,
  played,
}: {
  itemRef: Ref<HTMLDivElement>;
  user: any;
  top: any;
  played: any;
}) {
  console.table(top);
  function myLoader({src, width, quality}: any) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  return (
    <div
      ref={itemRef}
      style={{
        backgroundColor: '#111',
      }}
      className="background w-[750px] aspect-[9/16] flex items-center justify-center px-16">
      <div className="wrapper-items text-center">
        <h2 className="text-lg font-bold my-5">
          {DateTime.now().toFormat('MMMM')}&apos;s Gridify
        </h2>

        <div className=" my-5 flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg border border-white/30 w-full h-full">
          <picture>
            <img
              width={80}
              height={80}
              src={user.spotify_users.profile_pic_url}
              className="rounded-full z-50"
              alt={user.name}
            />
          </picture>

          <div>
            <p className="font-bold m-0 text-lg">{user.name}</p>
            <p className="muted text-left m-0">@{user.username}</p>
          </div>
        </div>

        <div className="grid-content">
          {/* Album art grid */}
          <div className="grid grid-cols-4 gap-5">
            {top.slice(0, 12).map((song: any, index: number) => {
              // console.log(song.color);

              // console.log(chroma(song.color).hex());
              return (
                <div
                  key={index}
                  style={{
                    boxShadow: `0 0 50px ${song.color}`,
                    background: `${chroma(song.color).darken(0.8).hex()}`,
                    border: `2px solid ${chroma(song.color).darken(0.1).hex()}`,
                  }}
                  className={`rounded-lg border border-white/60`}>
                  <picture>
                    <img
                      src={`data:image/jpeg;base64, ${song.album_art_base64}`}
                      className="rounded-tr-lg rounded-tl-lg z-50"
                      alt={song.name}
                    />
                  </picture>

                  <div className="flex flex-col items-center justify-center text p-2 h-100">
                    <p className="font-bold m-0">{song.name}</p>

                    <p className="text-sm muted m-0">
                      {song.artists.map((a: any) => a.name).join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-text/70">
          <strong>View my Musicn profile at</strong>
          <p>
            musicnapp.com/user/
            {user.username}
          </p>
        </div>

        {/* <p className="text-xs muted">
					Generated on {DateTime.now().toFormat('DDD')}
				</p> */}
      </div>
    </div>
  );
}

function Nothing({text}: {text: string}) {
  return (
    <div className="text-text/50 text-center my-20">
      <p>{text}</p>
    </div>
  );
}

export default GridifyHome;
