import { motion } from 'framer-motion';
import { IoShare } from 'react-icons/io5';

type ShareButtonProps = {
	url: string;
	overrideText?: string;
};

const ShareButton = ({ url, overrideText }: ShareButtonProps) => {
	const handleShare = () => {
		// Open share window sharing current page

		if (navigator.canShare({ url })) {
			navigator.share({ url });
		}
	};

	return (
		<div className="flex items-center justify-center">
			<motion.button
				whileHover={{
					scale: 1.1,
				}}
				whileTap={{
					scale: 0.9,
				}}
				onClick={handleShare}
				className="fixed bottom-0 px-10 py-3 gap-2 rounded-lg bg-blue-500 shadow-lg shadow-blue-500/50 m-5 flex items-center justify-center"
			>
				<IoShare size={25} />
				{overrideText || 'Share Profile'}
			</motion.button>
		</div>
	);
};

export default ShareButton;
