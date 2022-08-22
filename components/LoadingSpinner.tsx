import { Bars } from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const LoadingSpinner = () => {
	return (
		<Bars
			height="80"
			width="80"
			color="white"
			ariaLabel="bars-loading"
			wrapperStyle={{}}
			wrapperClass=""
			visible={true}
		/>
	);
};

export default LoadingSpinner;
