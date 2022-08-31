interface Array {
	first(): any;
}

interface BigInt {
	toJSON(): number;
}

interface IHandler {
	(req: NextApiRequest, res: NextApiResponse<any>): Promise<void>;
}

type TokenData = {
	user_id: string;
};