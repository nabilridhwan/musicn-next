import prisma from '@/util/prisma';

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
          account: true,
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

export async function getAllUsers({query = ''}: {query?: string}) {
  const data = await prisma.app_users.findMany({
    select: {
      name: true,
      username: true,
      num_of_visitors: true,
      spotify_users: {
        select: {
          name: true,
          profile_pic_url: true,
          spotify_userid: true,
        },
      },
    },

    orderBy: {
      num_of_visitors: 'desc',
    },

    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: 'insensitive',
          },
        },

        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
      spotify_users: {
        isNot: null,
      },
      preferences: {
        account: true,
      },
    },
  });

  return data;
}

export async function getUserByUsername(input: string) {
  const data = await prisma.app_users.findFirst({
    where: {
      username: input,
    },
    include: {
      spotify_users: true,
      preferences: {
        select: {
          account: true,
          top: true,
          recent: true,
          current: true,
          updated_at: true,
        },
      },
    },
  });

  return data;
}

/**
 * The public version of getUserByUsername which doesn't include preferences and spotify users (which includes refresh tokens)
 * @param input
 */
export async function getUserByUsername_public(input: string) {
  const data = await prisma.app_users.findFirst({
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

  return data || null;
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

  return data || null;
}
