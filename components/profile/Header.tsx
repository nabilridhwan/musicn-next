import {Box, Heading, Text} from '@chakra-ui/react';

export default function Header({title, lead}: {title: string; lead: string}) {
  return (
    <Box my={10}>
      <Heading>{title}</Heading>
      <Text>{lead}</Text>
    </Box>
  );
}
