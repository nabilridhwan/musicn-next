import {motion} from 'framer-motion';
import {useContext} from 'react';
import {MusicPreviewDialogContext} from '../context/MusicPreviewDialogProvider';
import {Box, Card, Center, Image, Stack, Text} from '@chakra-ui/react';

type SongCardProps = {
  name: string;
  spotifyLink: string;
  artists: string;
  imageUrl: string;
  preview: string;
};
const SongCard = ({
  name,
  spotifyLink,
  artists,
  imageUrl,
  preview,
}: SongCardProps) => {
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
      data-test-id="song-card"
      onClick={handleSongClick}
      rounded={5}
      cursor={'pointer'}
      p={2}>
      <Stack gap={1}>
        <Image rounded={5} src={imageUrl} alt={'album-cover'} />

        <Box textAlign={'center'} my={2}>
          <Text
            noOfLines={2}
            textAlign={'center'}
            as={'b'}
            data-test-id="song-name"
            className="font-bold">
            {name}
          </Text>
          <Text
            noOfLines={1}
            textAlign={'center'}
            fontSize={'sm'}
            color={'whiteAlpha.600'}>
            {artists}
          </Text>
        </Box>
      </Stack>
    </Card>
  );
};

export default SongCard;
