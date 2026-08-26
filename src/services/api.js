import axios from 'axios';
import { getToken, generateMockToken, setToken, setUsername } from '../utils/auth';

const BASE_URL = 'http://localhost:8080/api';

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
    let token = getToken();
    if (!token) {
        const username = 'admin';
        setUsername(username);
        token = generateMockToken(username);
        setToken(token);
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export async function helloWorld() {
    const { data } = await client.get('/helloworld');
    return data;
}

export async function computeHash(input, algorithm) {
    const { data } = await client.post('/hash', { input, algorithm });
    return data;
}

export async function bubbleSort(array) {
    const { data } = await client.post('/bubblesort', { array });
    return data;
}

export async function exportTab(tab) {
    const response = await client.get('/export', {
        params: { tab },
        responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tab}_export.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export async function getStats(dimension = 'type') {
    const { data } = await client.get('/stats', { params: { dimension } });
    return data;
}