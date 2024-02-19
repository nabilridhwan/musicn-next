import {getAllUsers} from '@/model/users';
import UserCard from '@/components/UserCard';
import {Container, SimpleGrid} from '@chakra-ui/react';

const Users = async () => {
  //   TODO: Set the query properly
  const users = (await getAllUsers({query: ''})).filter(
    user => !!user.spotify_users,
  );

  return (
    <Container my={10} maxW={'6xl'}>
      <SimpleGrid columns={[1, 2, 3]} gap={2}>
        {users.map(user => {
          return (
            <UserCard
              key={user.spotify_users?.spotify_userid ?? user.username}
              name={user.name || ''}
              username={user.username}
              spotify_users={user.spotify_users ?? undefined}
              num_of_visitors={parseInt(user.num_of_visitors.toString())}
            />
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default Users;
