import type { NextPage } from 'next';
import { ReactNode } from 'react';

const CenterStage: NextPage<{ children: ReactNode }> = ({ children }) => {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			{children}
		</div>
	);
};

export default CenterStage;
