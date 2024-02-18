import {useEffect, useState} from 'react';
import {getCookie} from 'cookies-next';

export default function useUserSignedIn() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    if (getCookie('signed_in')) {
      setIsUserSignedIn(true);
    }
  }, []);

  return [isUserSignedIn];
}
