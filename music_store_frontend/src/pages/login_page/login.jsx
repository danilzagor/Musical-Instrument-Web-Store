import React, { useState, useContext } from 'react';
import axios from '../../utils/axiosInstance.js';
import { AuthContext } from '../../utils/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import {useTranslation} from "react-i18next";

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/login', { login, password });
            const response = await axios.get('/auth/verify');
            setUser(response.data.user);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            setError(error.response?.data || 'Invalid login or password');
        }
    };

    const handleOnRegister = async (e) => {
        e.preventDefault();
        navigate('/register');
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleLogin}>
                <h2 className={styles.formHeader}>{t('loginForm.login')}</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formInput}>
                    <label>{t('loginForm.loginLabel')}:</label>
                    <input
                        type="text"
                        required
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>

                <div className={styles.formInput}>
                    <label>{t('loginForm.passwordLabel')}:</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className={styles.formButton}>{t('loginForm.loginButton')}</button>
            </form>

            <div className={styles.alternateAction}>
                <h2>{t('loginForm.orRegister')}</h2>
                <button onClick={handleOnRegister} className={styles.formButton}>{t('loginForm.registerButton')}</button>
            </div>
        </div>
    );
};

export default Login;
