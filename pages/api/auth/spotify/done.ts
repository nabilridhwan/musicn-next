import InternalServerError from '@/class/Responses/InternalServerError';
import Spotify from '@/class/Spotify';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import {linkSpotifyUser} from '@/model/users';
import APITokenHandler from '@/util/APITokenHandler';
import {AxiosError} from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';
import {setCookie} from 'cookies-next';
import {createJWT} from '@/util/jwt';
import {Prisma, PrismaClient} from '@prisma/client';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
import {KnownClientError} from '@/util/KnownClientError';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    // TODO: Reject if not signed in (APITokenHandler)
    let {error, code} = req.query;

    // Reject if error
    // if(error){

    // }

    // Code is a query param that is returned from spotify after authentication
    if (code) {
      code = typeof code === 'string' ? code : code[0];

      const {refresh_token, access_token} =
        await Spotify.getRefreshTokenFromCode(
          code,
          process.env.SPOTIFY_SIGNUP_REDIRECT_URL!,
        );

      const {
        email,
        display_name,
        country,
        images,
        id: spotify_userid,
      } = await Spotify.getOwnUserProfile(access_token);

      const prisma = new PrismaClient();

      // Create the new user
      const createdUser = await prisma?.app_users
        .create({
          data: {
            name: display_name,
            email: email,
            username: spotify_userid,
            spotify_users: {
              create: {
                country: country,
                name: display_name,
                email: email,
                profile_pic_url: images[0].url || null,
                spotify_userid: spotify_userid,
                refresh_token: refresh_token,
              },
            },
            preferences: {
              create: {
                current: true,
                account: true,
                top: true,
                recent: true,
              },
            },
          },
        })
        .catch((e: PrismaClientKnownRequestError) => {
          console.log(e);
          if (e.code === 'P2002') {
            const error = KnownClientError.encodeError({
              name: 'User already exists',
              desc: 'A user with this email already exists. Try logging in instead.',
            });

            res.redirect(`/login?_e=${error}`);
          } else {
            const error = KnownClientError.encodeError({
              name: 'Something went wrong',
              desc: 'Something went wrong while signing up. Please try again later or use a different method.',
            });

            res.redirect(`/signup?_e=${error}`);
          }
        });

      if (!createdUser)
        return res.redirect('/login?_error=already_has_account');

      const token = createJWT(createdUser.user_id);

      // Set a date 1 hour from now
      const expires = new Date(Date.now() + 1000 * 60 * 60);

      setCookie('token', token, {
        req,
        res,
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      setCookie('signed_in', true, {
        req,
        res,
        expires,
        secure: process.env.NODE_ENV === 'production',
      });

      return res.redirect('/profile');

      // Write for the user
      // return new SuccessResponse(
      // 	'Updated/Linked Spotify user successfully',
      // 	{ user_id, name: display_name }
      // ).handleResponse(req, res);
    }
  } catch (error: any) {
    console.log(error);

    return new InternalServerError(error.message).handleResponse(req, res);
  }
}

export default withSetupScript(handler as IHandler);
