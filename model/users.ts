import prisma from '../util/PrismaClient';

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
		},
		take: limit,
	});

	return data || [];
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
	});

	return data || [];
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

	return data || [];
}

export async function getUserByUsername(input: string) {
	const data = await prisma.app_users.findMany({
		where: {
			username: input,
		},
		include: {
			spotify_users: true,
		},
	});

	return data || [];
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

	return data || [];
}

export async function getUserById(user_id: any) {
	const data = await prisma.app_users.findFirst({
		where: {
			user_id,
		},
		include: {
			spotify_users: true,
		},
	});

	return data || null;
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

	return data || [];
}
