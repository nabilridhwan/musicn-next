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

interface MusicPreviewDialogProviderProps {
	children?: ReactNode;
}

type MusicPreview = {
	title: string;
	artist: string;
	image: string;
	preview?: string;
	url: string;
};

type EditProfileProps = {
	username?: string;
	email?: string;
	name?: string;
	password?: string;
};

type SignupProps = {
	username: string;
	email: string;
	name: string;
	password: string;
	confirm_password: string;
};

type Preferences = {
	top: boolean;
	current: boolean;
	recent: boolean;
};
