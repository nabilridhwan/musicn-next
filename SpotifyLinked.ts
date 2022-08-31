
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function setup() {

	const users = await prisma?.app_users.findMany({
		include: {
			spotify_users: true,
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
					activated: true
					
				},
				where: {
					user_id: user.user_id,
				},
			});
		}
	}
}

setup();