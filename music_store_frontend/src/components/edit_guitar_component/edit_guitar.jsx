import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import CreatableSelect from "react-select/creatable";
import styles from './edit_guitar.module.css';
import { useParams, useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";

const EditGuitar = ({ guitarData, onClose }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        instrument_name: "",
        instrument_price: "",
        instrument_description: "",
        brand_name: "",
        color_name: "",
        scale: "",
        type_name: "",
        image: null,
    });
    const [filters, setFilters] = useState({ brands: [], colors: [], types: [] });
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (guitarData) {
            setFormData({
                instrument_name: guitarData.instrument_name,
                instrument_price: guitarData.instrument_price,
                instrument_description: guitarData.instrument_description,
                brand_name: guitarData.brand_name,
                color_name: guitarData.color_name,
                scale: guitarData.guitar_scale,
                type_name: guitarData.type_name,
                image: null,
            });
        }
    }, [guitarData]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axiosInstance.get("/guitars/filters");
                setFilters(response.data);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };
        fetchFilters();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (selectedOption, name) => {
        setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : "" });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            await axiosInstance.put(`/guitars/${id}`, formDataToSend);
            navigate(`/guitars/${id}`);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error editing guitar:", error);
        }
    };

    return (
        <div className={styles.editContainer}>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <button type="button" className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.instrument_name')}</label>
                    <input
                        type="text"
                        name="instrument_name"
                        value={formData.instrument_name}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.price')}</label>
                    <input
                        type="number"
                        name="instrument_price"
                        value={formData.instrument_price}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.description')}</label>
                    <textarea
                        name="instrument_description"
                        value={formData.instrument_description}
                        onChange={handleChange}
                        className={styles.textarea}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.brand')}</label>
                    <CreatableSelect
                        options={filters.brands.map((brand) => ({ value: brand, label: brand }))}
                        value={formData.brand_name ? { value: formData.brand_name, label: formData.brand_name } : null}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, "brand_name")}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.color')}</label>
                    <CreatableSelect
                        options={filters.colors.map((color) => ({ value: color, label: color }))}
                        value={formData.color_name ? { value: formData.color_name, label: formData.color_name } : null}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, "color_name")}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.scale')}</label>
                    <input
                        type="number"
                        name="scale"
                        value={formData.scale}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.type')}</label>
                    <CreatableSelect
                        options={filters.types.map((type) => ({ value: type, label: type }))}
                        value={formData.type_name ? { value: formData.type_name, label: formData.type_name } : null}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, "type_name")}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.image')}</label>
                    <input type="file" name="image" className={styles.input} onChange={handleFileChange} />
                </div>
                <div className={styles.formGroup}>
                    <button type="submit" className={styles.button}>{t('form.update_button_guitar')}</button>
                </div>
            </form>
        </div>
    );
};

export default EditGuitar;
