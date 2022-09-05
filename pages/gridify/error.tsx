import CenterStage from '@/components/CenterStage';
import Section from '@/components/Section';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GridifyErrorResponse } from '.';
import Container from '../../components/Container';

type UsersProps = {
	user: any;
	top: any;
	played: any;
};

const defaultError: GridifyErrorResponse = {
	error: 'There was an error while generating your gridify',
	errorMessage: 'Try again later',
	linkPlaceholder: 'Go back to home',
	link: '/',
};

// Encode JSON to base64
export const encode = (data: any) => {
	return Buffer.from(JSON.stringify(data)).toString('base64');
};

// Decode base64 to JSON
export const decode = (data: string) => {
	return JSON.parse(Buffer.from(data, 'base64').toString());
};

const GridifyError = ({ user, top: topFromServer, played }: UsersProps) => {
	const router = useRouter();

	const { error } = router.query;

	const [errorData, setErrorData] = useState<GridifyErrorResponse | null>(
		null
	);

	useEffect(() => {
		if (error) {
			const e = Array.isArray(error) ? error[0] : error;
			console.log(e);
			console.log(decode(e));
			setErrorData(decode(e as string));
		}
	}, [error]);

	return (
		<>
			<Head>
				<title>Gridify</title>

				<meta
					name="description"
					content="Show your top songs as a grid!"
				></meta>
			</Head>

			<div className="overflow-clip max-h-full">
				<Container>
					<CenterStage>
						<Section>
							<div className="text-center flex flex-col items-center justify-center my-10">
								<h1>{errorData?.error}</h1>
								<p className="muted">
									{errorData?.errorMessage}
								</p>
								{errorData?.link && (
									<Link
										href={
											Array.isArray(errorData?.link)
												? errorData?.link[0]
												: errorData?.link
										}
									>
										<a className="btn btn-primary">
											{errorData?.linkPlaceholder}
										</a>
									</Link>
								)}
							</div>
						</Section>
					</CenterStage>
				</Container>
			</div>
		</>
	);
};

export default GridifyError;
