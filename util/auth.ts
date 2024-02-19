// src/auth.ts
import {Lucia, TimeSpan} from 'lucia';
import {PrismaAdapter} from '@lucia-auth/adapter-prisma';
import {Spotify} from 'arctic';

const client = prisma!;

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'd'),
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

export const spotify = new Spotify(
  process.env.CLIENT_ID!,
  process.env.CLIENT_SECRET!,
  process.env.SPOTIFY_REDIRECT_URL!,
);

// TODO: MOVE THIS TO OTHER FILE
// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }

  interface DatabaseSessionAttributes {
    user_id: number;
    username: string;
    spotify_user_id: string;
  }
}
