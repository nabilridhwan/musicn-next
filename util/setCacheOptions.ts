import { NextApiResponse } from 'next';

export function setCacheOptions(res: NextApiResponse) {
	res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
}
