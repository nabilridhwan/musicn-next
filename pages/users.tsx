import Link from 'next/link';
import CenterStage from '../components/CenterStage';
import Container from '../components/Container';
import Section from '../components/Section';
import axiosInstance from '../util/axiosInstance';

type UsersProps = {
	users: any[];
};

export async function getServerSideProps(context: any) {
	const users = await axiosInstance.get(`/api/user`);

	return {
		props: {
			users: users.data.data,
		},
	};
}

const Users = ({ users }: UsersProps) => {
	console.log(users);
	return (
		<CenterStage>
			<Container>
				<Section>
					{users.map((user, index) => {
						return (
							<div key={index}>
								<h1>{decodeURI(user.name)}</h1>
								<p>@{user.username}</p>

								{user.spotify_users && (
									<div>
										<p>
											Spotify name:{' '}
											{user.spotify_users.name}
										</p>
										<p>
											Spotify user id:{' '}
											{user.spotify_users.spotify_userid}
										</p>

										<Link href={`/user/${user.username}`}>
											<a>Profile</a>
										</Link>
									</div>
								)}
							</div>
						);
					})}
				</Section>
			</Container>
		</CenterStage>
	);
};

export default Users;
