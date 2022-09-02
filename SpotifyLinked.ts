import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function setup() {
	const users = await prisma?.app_users.findMany({
		include: {
			spotify_users: true,
			preferences: true,
		},
		orderBy: {
			spotify_users: {
				name: 'asc',
			},
		},
	});

	for (let user of users!) {
		if (user.spotify_users) {
			await prisma?.app_users.update({
				data: {
					spotify_linked: true,
					activated: true,
					preferences: {
						upsert: {
							create: {
								top: true,
								current: true,
								recent: true,
							},
							update: {
								account: user.preferences?.account,
								top: user.preferences?.top,
								current: user.preferences?.current,
								recent: user.preferences?.recent,
							},
						},
					},
				},
				where: {
					user_id: user.user_id,
				},
			});
		}
	}
}

setup();
