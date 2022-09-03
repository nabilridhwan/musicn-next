import type { NextPage } from 'next';
import { ReactNode } from 'react';

const Section: NextPage<{ children: ReactNode }> = ({ children }) => {
	return <div className="my-10 mb-32">{children}</div>;
};

export default Section;
