import { AxiosResponse } from 'axios';

type PARParams = {
	[prop: string]: Promise<AxiosResponse>;
};

export default async function PromisifyAxiosResponse(
	responses: PARParams,
	innerKey?: string
) {
	let keys = Object.keys(responses);
	let values = Object.values(responses);
	let rtnObj: { [prop: string]: AxiosResponse } = {};

	try {
		const promiseResults = await Promise.all(values);
		promiseResults.forEach((result, index) => {
			if (innerKey && result.data[innerKey]) {
				rtnObj[keys[index]] = result.data[innerKey];
			} else {
				rtnObj[keys[index]] = result.data;
			}
		});
	} catch (error) {
		console.log('Error in PromisifyAxiosResponse: ', error);
	}

	return rtnObj;
}
