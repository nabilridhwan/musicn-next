'use client';

import {PropsWithChildren} from 'react';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';

// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({config});

/**
 * This file contains the providers for the application
 * @param children
 * @constructor
 */
export default function Providers({children}: PropsWithChildren<{}>) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
