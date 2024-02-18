# This project is in the progress of migrating to the new Next.js

Here's how the migration is done

1. We are migrating to using React Server Components (RSC), the API routes in the old pages directory will be sunsetting
   soon. All actions will be done via functions in the RSC.
    - For example for `api/songs/current`, it is moved to the `api` folder containing the function `getCurrentSong`.
      This will be done to all the API routes sooner or later. Loading states are done via React Suspense.
2. While migrating pages, old pages in the `pages` directory will be moved to the `pages/old` directory. This is to
   ensure that the old pages are still accessible while the new pages are being developed.
    - To prevent conflict, old pages are pre-pended with `_` in the file name (e.g. `signup.tsx` will be renamed
      to `_signup.tsx`)
3. During the migration, we'll be changing the authentication model to use OAuth2.0. This allows users to log in/sign up
   with their Spotify account. In the later steps, users might problems logging in/signing up. Please bear with us.
4. During the migration, some features might be removed temporarily. This is to ensure that the migration is done
   smoothly. Features will be added back once the migration is done.

## Migration Progress

- [x] Home Page
- [x] Users page
- [x] Login page and logic (uses OAuth2.0, lucia and arctic)
- [x] Logout
- [ ] User page (Half done)
- [ ] Signup page and logic (uses OAuth2.0, lucia and arctic)
