import React, { useState } from 'react';
import axios from '../../utils/axiosInstance.js';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css';
import {useTranslation} from "react-i18next";

const Register = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const {t} = useTranslation();

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/register', { login, password, name, surname, email });
            alert('Registration successful. You can now log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            setError(error.response?.data || 'An unexpected error occurred');
        }
    };

    const handleOnLogin = async (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleRegister}>
                <h2 className={styles.formHeader}>{t('registerForm.register')}</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formInput}>
                    <label>{t('registerForm.loginLabel')}:</label>
                    <input
                        type="text"
                        required
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>

                <div className={styles.formInput}>
                    <label>{t('registerForm.passwordLabel')}:</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles.formInput}>
                    <label>{t('registerForm.nameLabel')}:</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className={styles.formInput}>
                    <label>{t('registerForm.surnameLabel')}:</label>
                    <input
                        type="text"
                        required
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>

                <div className={styles.formInput}>
                    <label>{t('registerForm.emailLabel')}:</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button type="submit" className={styles.formButton}>{t('registerForm.registerButton')}</button>
            </form>

            <div className={styles.alternateAction}>
                <h2>{t('registerForm.orLogin')}</h2>
                <button onClick={handleOnLogin} className={styles.formButton}>{t('registerForm.loginButton')}</button>
            </div>
        </div>
    );
};

export default Register;
