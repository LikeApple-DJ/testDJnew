import { useState, useCallback } from 'react';
import { getToken, setToken, removeToken, getUser, setUser, removeUser, isAuthenticated as checkAuth } from '../utils/auth';
import api from '../api';

export function useAuth() {
    const [user, setUserState] = useState(getUser);
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth);

    const login = useCallback(async (username, password) => {
        const res = await api.post('/api/auth/login', { username, password });
        const { token, user: userData } = res.data;
        setToken(token);
        setUser(userData);
        setUserState(userData);
        setIsAuthenticated(true);
        return userData;
    }, []);

    const register = useCallback(async (data) => {
        const res = await api.post('/api/auth/register', data);
        const { token, id, username, personType, personLevel, personDept } = res.data;
        setToken(token);
        const userData = { id, username, personType, personLevel, personDept };
        setUser(userData);
        setUserState(userData);
        setIsAuthenticated(true);
        return userData;
    }, []);

    const logout = useCallback(() => {
        removeToken();
        removeUser();
        setUserState(null);
        setIsAuthenticated(false);
    }, []);

    return { user, isAuthenticated, login, register, logout };
}