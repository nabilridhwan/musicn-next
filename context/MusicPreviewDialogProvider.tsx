import React from 'react';

export const MusicPreviewDialogContext = React.createContext<any>(null);

export default function MusicPreviewDialogProvider({
  children,
}: MusicPreviewDialogProviderProps) {
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [songDetails, setSongDetails] = React.useState<MusicPreview | null>(
    null,
  );

  const [_volume, _setVolume] = React.useState<number>(0.5);

  const showSongPreview = (song: MusicPreview) => {
    setShowDialog(true);
    setSongDetails(song);
  };

  const hideSongPreview = () => {
    setShowDialog(false);
    setSongDetails(null);
  };

  const setVolume = (volume: number) => {
    // Save to localStorage
    localStorage.setItem('volume', volume.toString());
    _setVolume(volume);
  };

  const volume = () => {
    return parseFloat(localStorage.getItem('volume') || '0.5');
  };

  return (
    <MusicPreviewDialogContext.Provider
      value={{
        showDialog,
        showSongPreview,
        hideSongPreview,
        songDetails,
        setVolume: setVolume,
        volume,
      }}>
      {children}
    </MusicPreviewDialogContext.Provider>
  );
}
