import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { AuthContext } from "../../utils/authContext.jsx";
import styles from "./profile.module.css";
import {useTranslation} from "react-i18next";

const Profile = () => {
    const [userInformation, setUserInformation] = useState(null);
    const { user } = useContext(AuthContext);
    const [editProfile, setEditProfile] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axiosInstance.get(`/users/${user.id}`);
                setUserInformation(userResponse.data);
                setName(userResponse.data.name);
                setSurname(userResponse.data.surname);
                setEmail(userResponse.data.email);
                setPhone(userResponse.data.phone_number);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (user?.id) fetchData();
    }, [user?.id]);

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const payload = { name, surname, email, phone };
            const response = await axiosInstance.put(`/users/${user.id}`, payload);

            setUserInformation(response.data);
            setEditProfile(false);
            setSuccessMessage("Profile updated successfully.");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleLogout = async () =>{
        try{
            await axiosInstance.post(`/auth/logout`, {});
            window.location.reload();
        }catch(err){
            console.error("Error logout:", err);
        }

    }




    return (
        <div className={styles.profileContainer}>
            {userInformation ? (
                <>
                    <h1 className={styles.profileHeader}>{t('profile.userInformation')}</h1>
                    <h2 className={styles.userInfo}>
                        {userInformation.name} {userInformation.surname}
                    </h2>
                    <h3 className={styles.userInfo}>{userInformation.email}</h3>
                    <h3 className={styles.userInfo}>{userInformation.phone_number}</h3>
                    <button
                        className={styles.editButton}
                        onClick={() => setEditProfile(!editProfile)}
                    >
                        {editProfile ? t('profile.cancel') : t('profile.editProfile')}
                    </button>
                    <button className={styles.logoutButton} onClick={handleLogout}>{t('profile.logout')}</button>
                </>
            ) : (
                <h1 className={styles.profileHeader}>{t('profile.loading')}</h1>
            )}

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            {editProfile && (
                <form onSubmit={handleEdit}>
                    <h2 className={styles.formHeader}>{t('profile.editProfile')}</h2>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('profile.name')}</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('profile.surname')}</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            required
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('profile.email')}</label>
                        <input
                            type="email"
                            className={styles.inputField}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('profile.phone')}</label>
                        <input
                            type="tel"
                            className={styles.inputField}
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        {t('profile.saveChanges')}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Profile;
