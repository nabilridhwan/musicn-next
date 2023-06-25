import updatePreferences from '@/frontend-api/user/updatePreferences';
import {Header} from '@/pages/profile';
import {Switch} from '@headlessui/react';
import {useMutation} from '@tanstack/react-query';
import {DateTime} from 'luxon';
import {SyntheticEvent, useEffect, useState} from 'react';
import ButtonWithLoading from '../ButtonWithLoading';

export default function PreferencesSection({user: userFromProps}: any) {
  const [originalUser, setOriginalUser] = useState(userFromProps);
  const [user, setUser] = useState(userFromProps);

  const [hasSpotify, setHasSpotify] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [preferenceChanged, setPreferenceChanged] = useState(false);

  const [originalAccount, setOriginalAccount] = useState(true);
  const [originalTop, setOriginalTop] = useState(true);
  const [originalCurrent, setOriginalCurrent] = useState(true);
  const [originalRecent, setOriginalRecent] = useState(true);

  const [account, setAccount] = useState(true);
  const [top, setTop] = useState(true);
  const [current, setCurrent] = useState(true);
  const [recent, setRecent] = useState(true);

  const {
    status: updateStatus,
    error: updateError,
    mutateAsync: updatePreferencesAsync,
  } = useMutation(
    ['updatePreference', user],
    async (obj: Preferences) => await updatePreferences(obj),
  );
  useEffect(() => {
    if (
      user.hasOwnProperty('preferences') &&
      user.preferences &&
      (user.preferences as any).id
    ) {
      setHasPreferences(true);

      const {top, current, recent, account} = user.preferences;

      setOriginalAccount(account);
      setOriginalTop(top);
      setOriginalCurrent(current);
      setOriginalRecent(recent);

      setAccount(account);
      setTop(top);
      setCurrent(current);
      setRecent(recent);
    }
  }, [user]);

  useEffect(() => {
    // One of the preferences change
    if (
      top !== originalTop ||
      current !== originalCurrent ||
      recent !== originalRecent
    ) {
      setPreferenceChanged(true);
    } else {
      setPreferenceChanged(false);
    }
  }, [top, current, recent, originalTop, originalCurrent, originalRecent]);

  useEffect(() => {
    if (updateStatus === 'success') {
      setOriginalCurrent(current);
      setOriginalRecent(recent);
      setOriginalTop(top);
    }
  }, [updateStatus, current, recent, top]);

  async function handlePreferenceUpdate(e: SyntheticEvent) {
    e.preventDefault();
    await updatePreferencesAsync({top, recent, current, account});
  }

  return (
    <>
      <Header
        title="Preferences"
        lead="Change your preferences and what you want to show on your profile"
      />

      {updateStatus === 'success' && (
        <div className="alert alert-success">
          Preferences updated successfully!
        </div>
      )}

      {hasPreferences && (
        <p className="muted my-2">
          Last changed:{' '}
          {DateTime.fromISO(userFromProps.preferences.updated_at).toRelative()}
        </p>
      )}

      <Switch.Group>
        <div className="flex items-center my-4">
          <Switch.Label htmlFor="Currently Playing Song" className="my-0">
            Account
          </Switch.Label>

          <Switch
            checked={account}
            onChange={() => setAccount(!account)}
            id="Recently Played Songs"
            className={`${
              account ? 'bg-blue-600' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span className="sr-only">Account</span>
            <span
              className={`${
                account ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
      </Switch.Group>

      <Switch.Group>
        <div className="flex items-center my-4">
          <Switch.Label htmlFor="Currently Playing Song" className="my-0">
            Top Songs
          </Switch.Label>

          <Switch
            onChange={() => setTop(!top)}
            checked={top}
            id="Top Songs"
            className={`${
              top ? 'bg-blue-600' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span className="sr-only">Account</span>
            <span
              className={`${
                top ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
      </Switch.Group>

      <Switch.Group>
        <div className="flex items-center my-4">
          <Switch.Label htmlFor="Currently Playing Song" className="my-0">
            Recently Played Songs
          </Switch.Label>

          <Switch
            checked={recent}
            onChange={() => setRecent(!recent)}
            id="Recently Played Songs"
            className={`${
              recent ? 'bg-blue-600' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span className="sr-only">Recently played songs</span>
            <span
              className={`${
                recent ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
      </Switch.Group>

      <Switch.Group>
        <div className="flex items-center my-4">
          <Switch.Label htmlFor="Currently Playing Song" className="my-0">
            Currently Playing Song
          </Switch.Label>

          <Switch
            checked={current}
            onChange={() => setCurrent(!current)}
            className={`${
              current ? 'bg-blue-600' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span className="sr-only">Currently Playing Song</span>
            <span
              className={`${
                current ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
      </Switch.Group>

      <ButtonWithLoading
        disabled={updateStatus === 'loading'}
        isLoading={updateStatus === 'loading'}
        onClick={handlePreferenceUpdate}
        text="Update Preferences"
      />
    </>
  );
}
