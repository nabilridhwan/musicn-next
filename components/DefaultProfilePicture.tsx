import { IoPerson } from 'react-icons/io5';
const DefaultProfilePicture = () => {
	return (
		<div className="bg-teal-500 flex items-center justify-center rounded-full w-20 h-20 lg:w-28 lg:h-28">
			<IoPerson size={40} />
		</div>
	);
};

export default DefaultProfilePicture;
