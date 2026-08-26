const TOKEN_KEY = 'app_jwt_token';
const USERNAME_KEY = 'app_username';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getUsername() {
    return localStorage.getItem(USERNAME_KEY) || 'anonymous';
}

export function setUsername(username) {
    localStorage.setItem(USERNAME_KEY, username);
}

export function generateMockToken(username) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: username, iat: Date.now() / 1000 }));
    return `${header}.${payload}.mock-signature`;
}