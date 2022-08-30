import { getCookie } from 'cookies-next';
import Container from '../components/Container';
import Section from '../components/Section';

export async function getServerSideProps(context: any) {
	// TODO: Check for existing cookies

	const token = getCookie('token', { req: context.req, res: context.res });

	if (token) {
		// Redirect to profile page
		return {
			redirect: {
				destination: '/profile',
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}

const LoginPage = () => {
	return (
		<Container>
			<Section>
				{/* Page header */}
				<header className="my-10">
					<h1>Login</h1>
					<p className="muted">Login into your account</p>
				</header>

				<form action="/api/login?redirect=/o" method="POST">
					<div className="form-group">
						<label htmlFor="username" className="">
							Email
						</label>
						<input
							name="username"
							type="text"
							className="form-control"
							id="username"
							placeholder="Enter username or email"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							name="password"
							type="password"
							className="form-control"
							id="password"
							placeholder="Password"
						/>
					</div>
					<button type="submit" className="btn btn-primary">
						Login
					</button>
				</form>
			</Section>
		</Container>
	);
};

export default LoginPage;
