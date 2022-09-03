---
title: 'Changelog'
desc: 'Musicn Changelog'
author: 'Nabil Ridhwan (@nabilridhwan)'
---

# Changelog

## [0.5.0] - 2022-09-03

### Added

-   Now you can see each other's recently played songs in the Musicn profile page!
    -   Adjust the visibility by changing your Preferences in the [Profile](/profile) page.
-   A footer for every foot out there!

### Changed

-   New Spotify account linking flow to make it easier for new users to link their Spotify account.
-   **[DEV]** Logging in will now give you the account's response (similar to `/api/me`)

### Fixed

-   None

### Removed

-   None

## [0.4.0] - 2022-09-02

### Added

-   Now you can change your account, currently playing song, top songs and recently played songs visibility (to the public)! 🎉
    -   Head over and change your preferences in the [Profile](/profile) page.
-   You can now see your Musicn profile's link directly in your Profile page. Copy and share the link with others (alternatively, you can click on the Share button in your Musicn profile page!)

### Changed

-   The Changelog page won't show when is the last updated time anymore. This is because I'm too lazy to update it every time I make a change. 😅
-   **[DEV]** With the new changes of preferences, the 3 APIs for Songs will give a `204 No Content` response if the user has set their preferences to not show their Spotify data.

### Fixed

-   Fixed a bug in signup where sending an empty username would result in the server crashing.
-   The navigation bar will now show `profile` and `logout` when you're signed in! 🎉
-   When not logged in and you are trying to attempt to go to the profile page, you'll be redirected to the login page instead of users.

### Removed

-   None

## [0.3.1] - 2022-08-31

### Added

-   Added loading spinners in buttons for Login, Signup and Edit profile buttons.

### Unresolved issues

-   The navigation bar will show 'Login' and 'Signup' even when you're logged in. Clicking on either this buttons will redirect you to your profile page.
    -   I'm still finding a good way to fix this while upholding security.

### Changed

-   When linking Spotify account, you will be redirected to Spotify's login page even if you have already previously signed in.
    -   This is so that users can change their Spotify account if needed.

### Fixed

-   Fixed issue where users will be redirected to the users page when they try to go to the profile page.
    -   Added BigInt serialization to the model file.
-   Fixed an issue where users who unlink Spotify accounts will receive either a `Internal Server Error` or `Client Error`.

### Removed

-   None

## [0.3.0] - 2022-08-31

### Added

-   **[BETA]** Added basic login and signing up capabilities! _(Behavior of login and signup might change in the future!)_
    -   Forget password functionality is still in development.
-   Added profile page.
    -   In this page, you can re-link or unlink your Spotify account and edit your profile. _(Behavior of linking and unlinking might change in the future!)_

### Unresolved issues

-   The navigation bar will show 'Login' and 'Signup' even when you're logged in. Clicking on either this buttons will redirect you to your profile page.
    -   I'm still finding a good way to fix this while upholding security.

### Changed

-   **[DEV]** Added alias for basePath in `tsconfig.js`. The path `@/` refers to the root directory now.
    ```js
    import { BaseResponse } from '../../classes/baseResponse'; // => OLD - Endless going back
    import { BaseResponse } from '@/classes/baseResponse'; // => NEW - Neater!
    ```

### Fixed

-   None

### Removed

-   None

### Security

-   None

## [0.2.2] - 2022-08-26

### Added

-   Add a new icon for Musicn! (New favicon)
-   Add title for every page in the Head tag

### Changed

-   None

### Fixed

-   Fixed `prisma is undefined` which causes users not to be able to access other users' profiles.
    -   This is fixed by adding a model function to update the profile picture and calling it in `/api/user/:username` instead of updating it directly from the route!

### Removed

-   None

### Security

-   None

## [0.2.1] - 2022-08-26

### Added

-   Added changelog page (you're looking at it now!)
-   All Spotify buttons that open songs will now open the song in the Spotify application instead of the browser!
-   Users with no top songs will show 'No top songs' on their page.
-   **[IN TESTING]** Profile picture now shows in the users page!

### Changed

-   Buttons in the users page (Profile and Spotify) will not be bolded anymore!
-   **[IN TESTING]** The User API will return the latest profile picture and set the profile picture into the database again (speed will be monitored!)

### Fixed

-   The Music Preview window will not slap you in the face and will now have proper animations!
-   Buttons in the home page will now have proper hover and tap animations!

### Removed

-   None

### Security

-   None

---

## [0.2.0] - 2022-08-26

### Added

-   Get a preview of what songs your friends are listening to by clicking on them a song in any page! A preview of the song will show in a separate dialog!

### Changed

-   All Song endpoints now return a `preview` property. This property gives a 30 seconds preview of the song. Those without a preview, the value will be `null`.

### Fixed

-   None

### Removed

-   None

### Security

-   None
