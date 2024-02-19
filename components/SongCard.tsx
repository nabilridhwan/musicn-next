'use client';
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
  // const {showSongPreview, hideSongPreview, songDetails, setVolume} = useContext(
  //   MusicPreviewDialogContext,
  // );

  const handleSongClick = () => {
    const song: MusicPreview = {
      title: name,
      artist: artists,
      image: imageUrl,
      preview,
      url: spotifyLink,
    };

    console.log(preview);

    // showSongPreview(song);
  };
  return (
    <Card border={'1px solid'} borderColor={'whiteAlpha.300'}>
      <Stack>
        <Image rounded={'lg'} src={imageUrl} alt={'album-cover'} />

        <Box mb={2} textAlign={'center'}>
          <Text fontWeight={'bold'}>{name}</Text>
          <Text color={'whiteAlpha.700'} fontSize={'sm'}>
            {artists}
          </Text>
        </Box>
      </Stack>
    </Card>
  );
};

export default SongCard;
