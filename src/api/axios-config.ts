import axios from 'axios';

const api = axios.create({
	baseURL: 'http://back:3000/',
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
