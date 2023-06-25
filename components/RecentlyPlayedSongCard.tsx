import {motion} from 'framer-motion';
import {DateTime} from 'luxon';
import {useContext} from 'react';
import {MusicPreviewDialogContext} from '../context/MusicPreviewDialogProvider';
import {Box, Card, HStack, Image, Text} from '@chakra-ui/react';

type SongCardProps = {
  name: string;
  spotifyLink: string;
  artists: string;
  imageUrl: string;
  preview: string;
  played_at: string;
};
const RecentlyPlayedSongCard = ({
  name,
  spotifyLink,
  artists,
  imageUrl,
  preview,
  played_at,
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
    <Card rounded={15} onClick={handleSongClick}>
      <HStack gap={5}>
        <Image roundedLeft={15} src={imageUrl} alt={name} height={20} />

        <Box w={'full'}>
          <Text
            as={'b'}
            noOfLines={1}
            data-test-id="song-name"
            className="font-bold">
            {name}
          </Text>
          <Text fontSize={'sm'} noOfLines={1} className="muted text-sm mb-0">
            {artists}
          </Text>

          <Text
            px={4}
            fontSize={'xs'}
            textAlign={'right'}
            className="uppercase text-sm mb-4 tracking-wider muted">
            {DateTime.fromISO(played_at).toRelative()}
          </Text>
        </Box>
      </HStack>
    </Card>
  );
};

export default RecentlyPlayedSongCard;
