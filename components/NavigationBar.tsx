import { motion } from 'framer-motion';
import Link from 'next/link';
import { IoHomeOutline, IoPeopleOutline } from 'react-icons/io5';

const NavigationBar = () => {
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
		</nav>
	);
};

export default NavigationBar;
