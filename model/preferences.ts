import setup from '@/util/FirstUtilScriptRun';
import prisma from '@/util/PrismaClient';

// Serializers and etc
setup();

export async function updatePreferences(user_id: any, data: Preferences) {
	// Update spotify user first

	// Find existing spotify user
	const existingPreferences = await prisma.preferences.findFirst({
		where: {
			user_id,
		},
	});

	// If no spotify user
	if (!existingPreferences) {
		// Create new preferences
		console.log(`====CREATING NEW PREFERENCES FOR USER ID ${user_id}====`);
		return await prisma.preferences.create({
			data: {
				user_id,
				...data,
			},
		});
	} else {
		// If existing one exists
		// Update preferences
		console.log(`====UPDATING PREFERENCES FOR USER ID ${user_id}====`);
		return await prisma.preferences.update({
			where: {
				id: existingPreferences.id,
			},
			data: {
				user_id,
				...data,
				updated_at: new Date(),
			},
		});
	}
}
