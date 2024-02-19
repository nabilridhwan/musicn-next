'use client';

import {PropsWithChildren} from 'react';
import {ChakraProvider} from '@chakra-ui/react';

/**
 * This file contains the providers for the application
 * @param children
 * @constructor
 */
export default function Providers({children}: PropsWithChildren<{}>) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
