import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllUsers() {
	const data = await prisma.app_users.findMany({
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

export async function getUserById(user_id: any) {
	const data = await prisma.app_users.findMany({
		where: {
			user_id,
		},
		include: {
			spotify_users: true,
		},
	});

	return data || [];
}
