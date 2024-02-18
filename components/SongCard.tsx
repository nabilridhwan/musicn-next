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
    <div className={'p-2 border rounded-lg'}>
      <div className={'space-y-1'}>
        <img className={'rounded-lg'} src={imageUrl} alt={'album-cover'} />

        <div className={'text-center my-2'}>
          <p className={'font-bold'}>{name}</p>
          <p>{artists}</p>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
