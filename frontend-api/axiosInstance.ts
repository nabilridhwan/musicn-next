import axios from 'axios';

function getHostUrl() {
	return process.env.NEXT_PUBLIC_FRONTEND_URL;
}

const axiosInstance = axios.create({
	baseURL: getHostUrl(),
});

export default axiosInstance;
