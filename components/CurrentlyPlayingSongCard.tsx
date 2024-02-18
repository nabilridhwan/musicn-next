import {motion} from 'framer-motion';
import {useContext} from 'react';

import {MusicPreviewDialogContext} from '../context/MusicPreviewDialogProvider';
import {Box, Card, HStack, Icon, Image, Text} from '@chakra-ui/react';

type MusicPlayerProps = {
  name: string;
  spotifyLink: string;
  artists: string;
  imageUrl: string;
  preview: string;
};

export const CurrentlyPlayingSongCard = ({
  name,
  spotifyLink,
  artists,
  imageUrl,
  preview,
}: MusicPlayerProps) => {
  const {showSongPreview, hideSongPreview, songDetails, setVolume} = useContext(
    MusicPreviewDialogContext,
  );

  const handleSongClick = () => {
    const song: MusicPreview = {
      title: name,
      artist: artists,
      image: imageUrl,
      preview,
      url: spotifyLink,
    };

    console.log(preview);

    showSongPreview(song);
  };

  return (
    <Card
      onClick={handleSongClick}
      cursor={'pointer'}
      className="flex items-center gap-3 border border-white/20 w-fit rounded-lg p-2"
      rounded={5}
      minW={300}
      p={10}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        background: `url(${imageUrl})`,
        backgroundPosition: 'center',
      }}>
      <Box
        bg={'blackAlpha.700'}
        w={'full'}
        h={'full'}
        pos={'absolute'}
        top={0}
        left={0}
        rounded={5}
      />

      <HStack zIndex={10} gap={3}>
        <Image src={imageUrl} alt={'album-cover'} height={20} />

        <section>
          <Text as={'b'} noOfLines={2}>
            {name}
          </Text>

          <Text fontSize={'xs'} color={'whiteAlpha.600'} noOfLines={2}>
            {artists}
          </Text>
        </section>

        <Box mx={2}>
          <p>Loading</p>
        </Box>
      </HStack>
    </Card>
  );
};

export const MusicPlayerNotPlaying = () => {
  return (
    <div className="flex items-center gap-2 border border-white/50 w-fit p-3 px-6 rounded-lg">
      {/* <img className="w-12 h-12" src={imageUrl} /> */}

      {/* <section>
				<p className="font-bold">{name}</p>
				<p className="muted text-sm mb-0">{artists}</p>
			</section> */}

      <section>
        <p className="muted text-sm mb-0"> nothing :&apos;(</p>
      </section>
    </div>
  );
};

export const MusicPlayerError = () => {
  return (
    <div className="flex items-center gap-2 border border-red-500 w-fit p-2 px-2 rounded-lg">
      {/* <img className="w-12 h-12" src={imageUrl} /> */}

      {/* <section>
				<p className="font-bold">{name}</p>
				<p className="muted text-sm mb-0">{artists}</p>
			</section> */}

      <section>
        <p className="text-sm mb-0 text-red-500">
          There was an error fetching currently playing song
        </p>
      </section>
    </div>
  );
};

export const MusicPlayerPrivate = () => {
  return (
    <div className="flex items-center gap-2 border border-white/50 w-fit p-3 px-6 rounded-lg">
      {/* <img className="w-12 h-12" src={imageUrl} /> */}

      {/* <section>
				<p className="font-bold">{name}</p>
				<p className="muted text-sm mb-0">{artists}</p>
			</section> */}

      <section>
        <p className="muted text-sm mb-0">The data is private :&apos;(</p>
      </section>
    </div>
  );
};
