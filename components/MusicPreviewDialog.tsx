import {AnimatePresence, motion} from 'framer-motion';
import Link from 'next/link';
import React, {useContext, useEffect} from 'react';
import {FaSpotify} from 'react-icons/fa';
import {IoClose, IoPause, IoPlay, IoStop} from 'react-icons/io5';
import {MusicPreviewDialogContext} from '../context/MusicPreviewDialogProvider';
import {Box, Button, Card, Heading, HStack, IconButton, Image, Text} from "@chakra-ui/react";

export type MusicPreview = {
    title: string;
    artist: string;
    image: string;
    preview?: string;
    url: string;
};

type MusicPreviewDialogProps = {
    handleClose: () => void;
};

export default function MusicPreviewDialog({
                                               handleClose,
                                           }: MusicPreviewDialogProps) {
    const {
        showDialog,
        showSongPreview,
        hideSongPreview,
        songDetails,
        setVolume,
        volume,
    } = useContext(MusicPreviewDialogContext);
    const audioElemRef = React.useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = React.useState<boolean>(true);

    useEffect(() => {
        setIsPlaying(true);
    }, [songDetails]);

    useEffect(() => {
        if (audioElemRef.current) {
            audioElemRef.current.volume = parseFloat(volume());
        }
    }, [audioElemRef, volume]);

    function handlePlay() {
        setIsPlaying(!isPlaying);

        if (audioElemRef.current) {
            if (isPlaying) {
                audioElemRef.current.pause();
            } else {
                audioElemRef.current.play();
            }
        }
    }

    function handleVolumeChange(e: any) {
        setVolume(e.target.volume);
    }

    return (
        <>
            <AnimatePresence>
                {songDetails && showDialog && (
                    <motion.div className="flex justify-center">
                        {/* Content */}
                        <motion.div
                            initial={{opacity: 0, y: 100}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 100}}
                            transition={{duration: 0.2, ease: 'easeOut'}}
                            className="flex border border-white/30 bg-black/50 backdrop-blur-xl items-center justify-between rounded-xl fixed bottom-8 gap-1 px-5 z-10 shadow-black/50 shadow-[0_0_50px] w-11/12 mx-auto">
                            {/* Song details */}
                            <Card boxShadow={5} rounded={15} m={5} p={2} position={"fixed"} right={0} bottom={0} w={'fit-content'}>
                                <HStack gap={5}>
                                    <HStack gap={3} flex={1}>
                                        <Image w={38} h={38} src={songDetails.image}
                                               alt={songDetails.title}/>

                                        <Link href={songDetails.url + '?go=1'}>
                                            <div>
                                                <Heading noOfLines={1} size={'sm'}>
                                                    {songDetails.title}
                                                </Heading>

                                                <Text noOfLines={1}>
                                                    {songDetails.artist}
                                                </Text>
                                            </div>
                                        </Link>
                                    </HStack>

                                    <Box justifyContent={'flex-end'}>

                                        {/* Show the audio dialog only if there is a song preview */}
                                        {songDetails.preview && (
                                            <audio
                                                onEnded={() => {
                                                    setIsPlaying(false);
                                                }}
                                                onTimeUpdate={e => {
                                                    console.log((e.target as any).currentTime);

                                                    console.log((e.target as any).duration);
                                                }}
                                                ref={audioElemRef}
                                                src={songDetails.preview}
                                                // TODO: Handle volume change
                                                onVolumeChange={handleVolumeChange}
                                                autoPlay
                                            />
                                        )}

                                        <HStack gap={2}>

                                            {songDetails.preview && (
                                                <>

                                                    <IconButton
                                                        variant={"ghost"}
                                                        aria-label={isPlaying ? 'Pause' : 'Play'}
                                                        onClick={handlePlay}
                                                    >

                                                        {isPlaying ? <IoPause/> : <IoPlay/>}
                                                    </IconButton>

                                                    {/*<IconButton*/}

                                                    {/*    variant={"ghost"}*/}
                                                    {/*    aria-label={'Stop'}*/}
                                                    {/*    onClick={handleClose}*/}
                                                    {/*>*/}
                                                    {/*    <IoStop/>*/}
                                                    {/*</IconButton>*/}

                                                    <IconButton

                                                        variant={"ghost"}
                                                        aria-label={'Close'}

                                                        onClick={handleClose}
                                                    >
                                                        <IoClose/>
                                                    </IconButton>
                                                </>
                                            )}

                                            <Link href={songDetails.url + '?go=1'}>
                                                <IconButton

                                                    variant={"ghost"}
                                                    aria-label={'Open in Spotify'}>
                                                    <FaSpotify/>
                                                </IconButton>
                                            </Link>
                                        </HStack>
                                    </Box>
                                </HStack>


                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function NoPreviewAvailable() {
    return (
        <div className="flex items-center gap-2 border border-white/50 w-fit p-3 px-6 rounded-lg">
            <section>
                <p className="muted text-sm mb-0">No preview available :&apos;(</p>
            </section>
        </div>
    );
}
