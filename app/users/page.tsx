import {getAllUsers} from '@/model/users';
import UserCard from '@/components/UserCard';

type UsersProps = {
  users: any[];
  query?: string;
};

const Users = async ({query = ''}: UsersProps) => {
  const users = (await getAllUsers({query})).filter(
    user => !!user.spotify_users,
  );

  return (
    <div className={'container mx-auto'}>
      <div className={'grid grid-cols-2 gap-2'}>
        {users.map(user => {
          return (
            <UserCard
              key={user.spotify_users?.spotify_userid ?? user.username}
              name={user.name || ''}
              username={user.username}
              spotify_users={user.spotify_users ?? undefined}
              num_of_visitors={0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Users;
