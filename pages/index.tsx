import type { NextPage } from 'next';
import CenterStage from '../components/CenterStage';
import Container from '../components/Container';
import Section from '../components/Section';

const Home: NextPage = () => {
	return (
		<Container>
			<CenterStage>
				<Section>
					<div className="text-center">
						<h1>Discover what other people are listening to</h1>

						<p className="muted">
							With Musicn, you can discover what other people are
							listening to, and create your own Musicn profile.
						</p>

						<button className="btn btn-full mt-10">
							Get started
						</button>
					</div>
				</Section>
			</CenterStage>
		</Container>
	);
};

export default Home;
