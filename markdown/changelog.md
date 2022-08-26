---
title: 'Changelog'
desc: 'Musicn Changelog'
author: 'Nabil Ridhwan (@nabilridhwan)'
last_updated: '2022-08-26'
---

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
