import {useRouter} from 'next/router';
import {KnownClientError} from '@/util/KnownClientError';
import {Alert, AlertIcon, Text} from '@chakra-ui/react';

export default function KnownClientErrorMessage() {
  const router = useRouter();

  const {_e} = router.query;

  if (!_e) {
    return null;
  }

  const encodedError = Array.isArray(_e) ? _e[0] : _e;

  const decodedError = KnownClientError.decodeError(encodedError);

  return (
    <Alert status="error" flexDirection={'column'} mb={8}>
      <AlertIcon />
      <Text fontWeight={'bold'}>{decodedError.name}</Text>
      <Text>{decodedError.desc}</Text>
    </Alert>
  );
}
