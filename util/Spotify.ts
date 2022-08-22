import axios from 'axios';

type SpotifyTerm = 'short_term' | 'medium_term' | 'long_term';

export default class Spotify {
	static async getAccessTokenFromRefreshToken(refreshToken: string) {
		const formData = new URLSearchParams();
		formData.append('grant_type', 'refresh_token');
		formData.append('refresh_token', refreshToken);

		const tokenResponse = await axios({
			method: 'POST',
			url: 'https://accounts.spotify.com/api/token',
			data: formData,
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
				).toString('base64')}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		if (tokenResponse.data.error) {
			throw new Error(tokenResponse.data.error);
		}

		if (!tokenResponse.data.access_token) {
			throw new Error('No access token');
		}

		return tokenResponse.data.access_token;
	}

	static async getCurrentlyPlayingSong(accessToken: string) {
		const response = await axios({
			method: 'GET',
			url: `https://api.spotify.com/v1/me/player/currently-playing`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.data || !response.data.item) {
			return {};
		}

		return response.data;
	}

	static async getTopSongs(
		accessToken: string,
		limit: number = 15,
		term: SpotifyTerm = 'short_term'
	) {
		const response = await axios({
			method: 'GET',
			url: `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${term}`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.data || !response.data.items) {
			return [];
		}

		return response.data.items;
	}

	static async getRecentlyPlayedSongs(accessToken: string) {
		const response = await axios({
			method: 'GET',
			url: `https://api.spotify.com/v1/me/player/recently-played?limit=10`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.data || !response.data.items) {
			return [];
		}

		return response.data.items;
	}

	static async getUserProfile(user_id: string, accessToken: string) {
		const response = await axios({
			method: 'GET',
			url: `https://api.spotify.com/v1/users/${user_id}`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.data || !Object.keys(response.data).length) {
			return {};
		}

		return response.data;
	}
}
