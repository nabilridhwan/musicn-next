import axios from 'axios';

function getHostUrl() {
	return process.env.NODE_ENV === 'production'
		? '/'
		: 'http://localhost:3000/';
}

const axiosInstance = axios.create({
	baseURL: getHostUrl(),
});

export default axiosInstance;
