import Spotify from '@/class/Spotify';
import {getUserByUsername} from '@/model/users';

export default async function getCurrentSong(username: string) {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.preferences && user.preferences.current === false) {
      throw new Error('Current song is disabled in preferences');
    }

    // Check if spotify_users is falsy
    if (!user.spotify_users) {
      throw new Error('Spotify account not linked');
    }

    const refresh_token = user.spotify_users.refresh_token;
    const accessToken = await Spotify.getAccessTokenFromRefreshToken(
      refresh_token,
    );

    let currentlyPlayingSong = await Spotify.getCurrentlyPlayingSong(
      accessToken,
    );

    if (Object.keys(currentlyPlayingSong).length > 0) {
      const currentlyPlayingSongData = currentlyPlayingSong.item;

      type CurrentlyPlayingSong = {
        id: string;
        name: string;
        artists: {
          name: string;
          id: string;
        }[];
        album: string;
        album_art: string;
        popularity: number;
        duration: number;
        preview: string | null;
        uri: string;
      };

      return {
        id: currentlyPlayingSongData.id,
        name: currentlyPlayingSongData.name,
        artists: currentlyPlayingSongData.artists.map((a: any) => ({
          name: a.name,
          id: a.id,
        })),
        album: currentlyPlayingSongData.album.name,
        album_art: currentlyPlayingSongData.album.images[0]?.url,
        popularity: currentlyPlayingSongData.popularity,
        duration: currentlyPlayingSongData.duration_ms,
        preview: currentlyPlayingSongData.preview_url ?? null,
        uri: currentlyPlayingSongData.uri,
      } as CurrentlyPlayingSong;
    }

    return null;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}
