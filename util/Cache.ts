import { NextApiResponse } from 'next';

export default class Cache {
	private static headerName: string = 'Cache-Control';

	/**
	 * Revalidates the cache in the edge server while showing the old stale data meanwhile.
	 * @param res NextApiResponse
	 */
	public static revalidateInBackground(res: NextApiResponse): void {
		res.setHeader(this.headerName, 's-maxage=1, stale-while-revalidate');
	}

	/**
	 * Caches the data in the edge server and expires after the given seconds, to which, it'll refetch and cache new data again.
	 * @param res NextApiResponse
	 * @param expiresAfterSeconds number
	 */
	public static inEdgeServer(
		res: NextApiResponse,
		expiresAfterSeconds: number
	): void {
		res.setHeader(this.headerName, `s-maxage=${expiresAfterSeconds}`);
	}
}
