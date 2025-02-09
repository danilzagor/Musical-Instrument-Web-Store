import { Link } from "react-router-dom";
import style from "./navbar.module.css"
import { useTranslation } from 'react-i18next';
import {useEffect, useState} from "react";

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        if (language) {
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);

    const changeLanguage = (event) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    return (
        <footer >
            <Link to="/">
                <img src="https://cdn-icons-png.flaticon.com/512/2741/2741308.png" alt="logo" />
            </Link>
            <nav className={style.navbar}>
                <Link to="/guitars">{t('navbar.guitars')}</Link>
                <Link to="/drums">{t('navbar.drums')}</Link>
                <Link to="/pianos">{t('navbar.pianos')}</Link>
                <Link to="/profile">{t('navbar.profile')}</Link>
                <Link to="/cart">{t('navbar.cart')}</Link>
                <select onChange={changeLanguage} value={language} className={style.languageDropdown}>
                    <option value="en">English</option>
                    <option value="ua">Українська</option>
                </select>
            </nav>
        </footer>
    );
};

export default Navbar;
