import {useState, useEffect} from "react";
import axios from "../../utils/axiosInstance.js";
import CreatableSelect from "react-select/creatable";
import styles from './add_piano.module.css';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const AddPiano = () => {
    const [formData, setFormData] = useState({
        instrument_name: "",
        instrument_price: "",
        instrument_description: "",
        brand_name: "",
        color_name: "",
        piano_scale: "",
        piano_pedals: "",
        image: null,
    });
    const [filters, setFilters] = useState({brands: [], colors: []});
    const navigate = useNavigate();
    const {t} = useTranslation();

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get("/pianos/filters");
                setFilters(response.data);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };
        fetchFilters();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSelectChange = (selectedOption, name) => {
        setFormData({...formData, [name]: selectedOption ? selectedOption.value : ""});
    };

    const handleFileChange = (e) => {
        setFormData({...formData, image: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post("/pianos", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/pianos")
        } catch (error) {
            console.error("Error adding piano:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.instrumentName')}</label>
                <input
                    type="text"
                    name="instrument_name"
                    value={formData.instrument_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.price')}</label>
                <input
                    type="number"
                    name="instrument_price"
                    value={formData.instrument_price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.description')}</label>
                <textarea
                    name="instrument_description"
                    value={formData.instrument_description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.brand')}</label>
                <CreatableSelect
                    options={filters.brands.map((brand) => ({value: brand, label: brand}))}
                    value={formData.brand_name ? {value: formData.brand_name, label: formData.brand_name} : null}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, "brand_name")}
                    placeholder={t('instrumentForm.selectOrTypeBrand')}
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.color')}</label>
                <CreatableSelect
                    options={filters.colors.map((color) => ({value: color, label: color}))}
                    value={formData.color_name ? {value: formData.color_name, label: formData.color_name} : null}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, "color_name")}
                    placeholder={t('instrumentForm.selectOrTypeColor')}
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.scale')}</label>
                <input
                    type="number"
                    name="piano_scale"
                    value={formData.piano_scale}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.numberOfPedals')}</label>
                <input
                    type="number"
                    name="piano_pedals"
                    value={formData.piano_pedals}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t('instrumentForm.image')}</label>
                <input type="file" name="image" onChange={handleFileChange} required />
            </div>
            <div className={styles.formGroup}>
                <button type="submit">{t('instrumentForm.addPiano')}</button>
            </div>
        </form>
    );
};

export default AddPiano;
