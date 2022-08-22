import { NextApiResponse } from 'next';

export function revalidateBackgroundCache(res: NextApiResponse) {
	res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
}

export function edgeCacheInSeconds(res: NextApiResponse, seconds: number) {
	res.setHeader('Cache-Control', `max-age=0, s-maxage=${seconds}`);
}
