import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import CreatableSelect from "react-select/creatable";
import styles from './edit_drum.module.css';
import { useParams, useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";

const EditDrum = ({ drumData, onClose }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        instrument_name: "",
        instrument_price: "",
        instrument_description: "",
        brand_name: "",
        color_name: "",
        floor_tom_number: "",
        tomtom_number: "",
        shell_material_name: "",
        image: null,
    });
    const [filters, setFilters] = useState({ brands: [], colors: [], shellMaterials: []});
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (drumData) {
            setFormData({
                instrument_name: drumData.instrument_name,
                instrument_price: drumData.instrument_price,
                instrument_description: drumData.instrument_description,
                brand_name: drumData.brand_name,
                color_name: drumData.color_name,
                floor_tom_number: drumData.floor_tom_number,
                tomtom_number: drumData.tomtom_number,
                shell_material_name: drumData.shell_material_name,
                image: null,
            });
        }
    }, [drumData]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axiosInstance.get("/drums/filters");
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
            await axiosInstance.put(`/drums/${id}`, formDataToSend);
            navigate(`/drums/${id}`);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error editing drum:", error);
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
                    <label className={styles.label}>{t('form.tomtom_number')}</label>
                    <input
                        type="number"
                        name="tomtom_number"
                        value={formData.tomtom_number}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.floor_tom_number')}</label>
                    <input
                        type="number"
                        name="floor_tom_number"
                        value={formData.floor_tom_number}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.type')}</label>
                    <CreatableSelect
                        options={filters.shellMaterials.map((type) => ({ value: type, label: type }))}
                        value={formData.shell_material_name ? { value: formData.shell_material_name, label: formData.shell_material_name } : null}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, "shell_material_name")}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.image')}</label>
                    <input type="file" name="image" className={styles.input} onChange={handleFileChange} />
                </div>
                <div className={styles.formGroup}>
                    <button type="submit" className={styles.button}>{t('form.update_button_drum')}</button>
                </div>
            </form>
        </div>
    );

};

export default EditDrum;
