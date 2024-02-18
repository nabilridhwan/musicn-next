import Spotify from '@/class/Spotify';
import {getUserByUsername} from '@/model/users';
import * as yup from 'yup';

export default async function getRecentSongs(username: string) {
  try {
    const user = await getUserByUsername(username);

    if (user === null) {
      console.error('User not found');
      throw new Error('User not found');
    }

    if (user.preferences && user.preferences.recent === false) {
      console.error('Recent songs is disabled in preferences');
      throw new Error('Recent songs is disabled in preferences');
    }

    // Check if spotify_users is falsy
    if (!user.spotify_users) {
      console.error('Spotify account not linked');
      throw new Error('Spotify account not linked');
    }

    const refresh_token = user.spotify_users.refresh_token;
    const accessToken = await Spotify.getAccessTokenFromRefreshToken(
      refresh_token,
    );

    let recentSongs = await Spotify.getRecentlyPlayedSongs(accessToken);

    type MappedRecentSongs = {
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
      played_at: string;
    };

    return recentSongs.map((song: any) => {
      return {
        id: song.track.id,
        name: song.track.name,
        artists: song.track.artists.map((a: any) => ({
          name: a.name,
          id: a.id,
        })),
        album: song.track.album.name,
        album_art: song.track.album.images[0]?.url,
        popularity: song.track.popularity,
        duration: song.track.duration_ms,
        preview: song.track.preview_url ?? null,
        uri: song.track.uri,
        played_at: song.played_at,
      };
    }) as MappedRecentSongs[];
  } catch (error: any) {
    console.error('error: ', error);
    return null;
  }
}
