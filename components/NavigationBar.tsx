import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
	IoExitOutline,
	IoHomeOutline,
	IoPeopleOutline,
	IoPersonOutline,
} from 'react-icons/io5';

const NavigationBar = () => {
	const [userSignedIn, setUserSignedIn] = useState(false);

	useEffect(() => {
		if (getCookie('signed_in')) {
			setUserSignedIn(true);
		}
	}, []);

	return (
		<nav className="flex flex-wrap gap-5 items-center justify-center my-10">
			<motion.div
				className="w-fit"
				whileHover={{
					scale: 1.1,
				}}
				whileTap={{
					scale: 0.9,
				}}
			>
				<Link href="/">
					<a className="flex items-center gap-2">
						<IoHomeOutline size={16} />
						home
					</a>
				</Link>
			</motion.div>
			<motion.div
				className="w-fit"
				whileHover={{
					scale: 1.1,
				}}
				whileTap={{
					scale: 0.9,
				}}
			>
				<Link href="/users">
					<a className="flex items-center gap-2">
						<IoPeopleOutline size={16} />
						users
					</a>
				</Link>
			</motion.div>

			{userSignedIn ? (
				<>
					<motion.div
						className="w-fit"
						whileHover={{
							scale: 1.1,
						}}
						whileTap={{
							scale: 0.9,
						}}
					>
						<Link href="/profile">
							<a className="flex items-center gap-2">
								<IoPersonOutline size={16} />
								profile
							</a>
						</Link>
					</motion.div>

					<motion.div
						className="w-fit"
						whileHover={{
							scale: 1.1,
						}}
						whileTap={{
							scale: 0.9,
						}}
					>
						<Link href="/api/logout">
							<a className="flex items-center gap-2">
								<IoExitOutline size={16} />
								logout
							</a>
						</Link>
					</motion.div>
				</>
			) : (
				<>
					<motion.div
						className="w-fit"
						whileHover={{
							scale: 1.1,
						}}
						whileTap={{
							scale: 0.9,
						}}
					>
						<Link href="/login">
							<a className="flex items-center gap-2">
								<IoPeopleOutline size={16} />
								login
							</a>
						</Link>
					</motion.div>

					<motion.div
						className="w-fit"
						whileHover={{
							scale: 1.1,
						}}
						whileTap={{
							scale: 0.9,
						}}
					>
						<Link href="/signup">
							<a className="flex items-center gap-2">
								<IoPeopleOutline size={16} />
								signup
							</a>
						</Link>
					</motion.div>
				</>
			)}
		</nav>
	);
};

export default NavigationBar;
