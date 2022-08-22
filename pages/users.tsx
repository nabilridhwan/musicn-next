import absoluteUrl from 'next-absolute-url';
import Link from 'next/link';
import CenterStage from '../components/CenterStage';
import Container from '../components/Container';
import Section from '../components/Section';
import getAllUsers from '../fe_controller/song/getAllUsers';

type UsersProps = {
	users: any[];
};

export async function getServerSideProps(context: any) {
	const { origin } = absoluteUrl(context.req);
	console.log(origin);
	const users = await getAllUsers();

	return {
		props: {
			users,
		},
	};
}

const Users = ({ users }: UsersProps) => {
	return (
		<CenterStage>
			<Container>
				<Section>
					{users.map((user, index) => {
						return (
							<div
								key={index}
								className="border border-white/50 break-all my-10 p-5 rounded-xl"
							>
								<h2 className="text-2xl font-bold">
									{decodeURI(user.name)}
								</h2>
								<p className="muted text-sm">
									@{user.username}
								</p>

								{user.spotify_users && (
									<div>
										{/* <p>
											Spotify name:{' '}
											{user.spotify_users.name}
										</p>
										<p>
											Spotify user id:{' '}
											{user.spotify_users.spotify_userid}
										</p> */}

										<Link href={`/user/${user.username}`}>
											<a className="btn btn-full my-2">
												Profile
											</a>
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
