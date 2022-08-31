// middleware.ts
import setup from '@/util/FirstUtilScriptRun';
import { NextApiRequest, NextApiResponse } from 'next';

interface IHandler {
	(req: NextApiRequest, res: NextApiResponse<any>): Promise<void>;
}

export default function withSetupScript(handler: IHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		console.log(`=====INJECTING PROTOTYPE FUNCTIONS IN ${req.url}=====`);
		setup();
		return handler(req, res);
	};
}
