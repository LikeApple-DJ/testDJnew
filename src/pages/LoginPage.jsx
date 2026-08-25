import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [personType, setPersonType] = useState('');
    const [personLevel, setPersonLevel] = useState('');
    const [personDept, setPersonDept] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegister) {
                await register({ username, password, personType, personLevel, personDept });
            } else {
                await login(username, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || '操作失败');
        }
    };

    const styles = {
        container: { maxWidth: '400px', margin: '80px auto', padding: '32px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'Arial, sans-serif' },
        title: { textAlign: 'center', marginBottom: '24px', color: '#333' },
        input: { display: 'block', width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
        button: { display: 'block', width: '100%', padding: '10px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
        switch: { textAlign: 'center', marginTop: '16px', color: '#1976d2', cursor: 'pointer', fontSize: '14px' },
        error: { color: 'red', marginBottom: '12px', fontSize: '14px' },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{isRegister ? '注册' : '登录'}</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input style={styles.input} placeholder="用户名" value={username}
                    onChange={e => setUsername(e.target.value)} required />
                <input style={styles.input} type="password" placeholder="密码" value={password}
                    onChange={e => setPassword(e.target.value)} required />
                {isRegister && (
                    <>
                        <input style={styles.input} placeholder="人员类型（如：技术岗/管理岗/运营岗）"
                            value={personType} onChange={e => setPersonType(e.target.value)} />
                        <input style={styles.input} placeholder="人员层级（如：初级/中级/高级/专家）"
                            value={personLevel} onChange={e => setPersonLevel(e.target.value)} />
                        <input style={styles.input} placeholder="人员部门（如：研发部/产品部/运维部）"
                            value={personDept} onChange={e => setPersonDept(e.target.value)} />
                    </>
                )}
                <button type="submit" style={styles.button}>
                    {isRegister ? '注册' : '登录'}
                </button>
            </form>
            <div style={styles.switch} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
            </div>
        </div>
    );
}

export default LoginPage;