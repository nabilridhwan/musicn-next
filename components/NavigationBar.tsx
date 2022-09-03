import { Menu, Transition } from '@headlessui/react';
import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
	IoCogOutline,
	IoExitOutline,
	IoHomeOutline,
	IoMenuOutline,
	IoPeopleOutline,
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
				<div>
					<Menu as="div" className="relative">
						<Menu.Button>
							<IoMenuOutline className="inline mr-1" />
							menu
						</Menu.Button>

						<Transition
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0"
						>
							<Menu.Items className="absolute left-0 top-2 bg-white text-black p-2 rounded-lg text-left">
								<Menu.Item>
									{({ active }) => (
										<Link href="/profile">
											<a
												className={`flex items-center gap-2 p-1 rounded-lg hover:bg-blue-100 hover:text-blue-500 ${
													active &&
													'bg-blue-100 text-blue-500'
												}`}
											>
												<IoCogOutline size={16} />
												Profile
											</a>
										</Link>
									)}
								</Menu.Item>

								<Menu.Item>
									{({ active }) => (
										<Link href="/api/logout">
											<a className="flex items-center gap-2 p-1 rounded-lg hover:bg-blue-100 hover:text-blue-500">
												<IoExitOutline size={16} />
												Logout
											</a>
										</Link>
									)}
								</Menu.Item>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
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
