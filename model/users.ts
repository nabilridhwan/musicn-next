import setup from '@/util/FirstUtilScriptRun';
import prisma from '@/util/PrismaClient';

// Serializers and etc
setup();

export async function getNewUsers(limit: number) {
	const data = await prisma.app_users.findMany({
		orderBy: {
			created_at: 'desc',
		},

		where: {
			spotify_users: {
				isNot: null,
			},
		},

		select: {
			name: true,
			email: true,
			username: true,
			spotify_users: {
				select: {
					name: true,
					profile_pic_url: true,
					spotify_userid: true,
				},
			},
			preferences: {
				select: {
					top: true,
					recent: true,
					current: true,
					updated_at: true,
				},
			},
		},
		take: limit,
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function getAllUsers() {
	const data = await prisma.app_users.findMany({
		select: {
			name: true,
			username: true,
			spotify_users: {
				select: {
					name: true,
					profile_pic_url: true,
					spotify_userid: true,
				},
			},
		},

		orderBy: {
			spotify_users: {
				name: 'asc',
			},
		},

		where: {
			spotify_users: {
				isNot: null,
			},
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function getUserByEmailOrUsername(input: string) {
	const data = await prisma.app_users.findMany({
		where: {
			OR: [
				{
					email: input,
				},
				{
					username: input,
				},
			],
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function getUserByUsername(input: string) {
	const data = await prisma.app_users.findMany({
		where: {
			username: input,
		},
		include: {
			spotify_users: true,
			preferences: {
				select: {
					top: true,
					recent: true,
					current: true,
					updated_at: true,
				},
			},
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function getUserByUsername_public(input: string) {
	const data = await prisma.app_users.findMany({
		select: {
			name: true,
			username: true,
			spotify_users: {
				select: {
					name: true,
					profile_pic_url: true,
					spotify_userid: true,
				},
			},
		},
		where: {
			username: input,
		},
		orderBy: {
			spotify_users: {
				name: 'asc',
			},
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function getUserById(user_id: any) {
	const data = await prisma.app_users.findFirst({
		where: {
			user_id,
		},
		include: {
			spotify_users: true,
			preferences: true,
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function updateProfilePictureUrl(
	user_id: any,
	profile_pic_url: string
) {
	const data = await prisma.app_users.update({
		where: {
			user_id: user_id,
		},
		data: {
			spotify_users: {
				update: {
					profile_pic_url: profile_pic_url,
				},
			},
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function updateOnlyUser(user_id: any, updatedData: any) {
	const data = await prisma.app_users.update({
		where: {
			user_id: user_id,
		},
		data: updatedData,
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

type AddNewUserProps = {
	username: string;
	email: string;
	name: string;
	password: string;
};

export async function addNewUser({
	username,
	email,
	name,
	password,
}: AddNewUserProps) {
	const data = await prisma.app_users.create({
		data: {
			username: username,
			email: email,
			name: name,
			password: password,
			spotify_linked: false,
			activated: false,
		},
		select: {
			user_id: true,
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

type LinkSpotifyUserProps = {
	email: string;
	name: string;
	spotify_userid: string;
	profile_pic_url: string;
	refresh_token: string;
	country: string;
	user_id: any;
};

export async function deleteSpotifyUserByUserID(user_id: any) {
	console.log('Deleting spotify user by user id');
	const data = await prisma.spotify_users.deleteMany({
		where: {
			user_id: user_id,
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}

export async function linkSpotifyUser({
	email,
	name,
	spotify_userid,
	profile_pic_url,
	refresh_token,
	country,
	user_id,
}: LinkSpotifyUserProps) {
	// Update spotify user first

	// Find existing spotify user
	const existingSpotifyUser = await prisma.spotify_users.findFirst({
		where: {
			OR: [
				{
					user_id: user_id,
				},
				{
					email: email,
				},
			],
		},
	});

	// If no spotify user
	if (!existingSpotifyUser) {
		// Create new spotify user
		console.log(`====CREATING NEW SPOTIFY USER TO USER ID ${user_id}====`);
		return await prisma.spotify_users.create({
			data: {
				user_id,
				email,
				name,
				spotify_userid,
				profile_pic_url,
				refresh_token,
				country,
			},
		});
	} else {
		// If existing one exists
		// Update existing spotify user
		console.log(`====UPDATING NEW SPOTIFY USER TO USER ID ${user_id}====`);
		return await prisma.spotify_users.update({
			where: {
				id: existingSpotifyUser.id,
			},
			data: {
				user_id,
				email,
				name,
				spotify_userid,
				profile_pic_url,
				refresh_token,
				country,
				updated_at: new Date(),
			},
		});
	}
}

export async function activateUserByUserID(user_id: any) {
	const data = await prisma.app_users.update({
		data: {
			activated: true,
		},
		where: {
			user_id,
		},
	});

	return JSON.parse(JSON.stringify(data)) || null;
}
