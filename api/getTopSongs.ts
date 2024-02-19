import Spotify from '@/class/Spotify';
import {getUserByUsername} from '@/model/users';

export default async function getTopSongs(username: string) {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.preferences && user.preferences.top === false) {
      throw new Error('Top songs is disabled in preferences');
    }

    // Check if spotify_users is falsy
    if (!user.spotify_users) {
      throw new Error('Spotify account not linked');
    }

    const refresh_token = user.spotify_users.refresh_token;
    const accessToken = await Spotify.getAccessTokenFromRefreshToken(
      refresh_token,
    );

    let topSongs = await Spotify.getTopSongs(accessToken, 15, 'short_term');

    // Filter data to include relevant data!
    type MappedTopSongs = {
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

    return topSongs.map((song: any) => {
      return {
        id: song.id,
        name: song.name,
        artists: song.artists.map((a: any) => ({
          name: a.name,
          id: a.id,
        })),
        album: song.album.name,
        album_art: song.album.images[0]?.url,
        popularity: song.popularity,
        duration: song.duration_ms,
        preview: song.preview_url ?? null,
        uri: song.uri,
      };
    }) as MappedTopSongs[];
  } catch (error: any) {
    console.error(error);
    return null;
  }
}
