import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import Select from "react-select";
import styles from "./edit_category.module.css";
import {useTranslation} from "react-i18next";

const EditCategory = ({ filterEndpoint, onClose }) => {
    const [filters, setFilters] = useState({ brand: [], color: [], type: [], shell_material: [] });
    const [filterName, setFilterName] = useState(null);
    const [oldName, setOldName] = useState(null);
    const [newName, setNewName] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axiosInstance.get(filterEndpoint);
                setFilters(response.data);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };
        fetchFilters();
    }, [filterEndpoint]);

    const handleSubmit = async () => {
        if (!filterName || !oldName || !newName.trim()) {
            console.error("Invalid data to update category.");
            return;
        }

        try {
            const payload = {
                filterName: filterName.value,
                oldName: oldName.value,
                newName: newName.trim(),
            };

            await axiosInstance.put(filterEndpoint, payload);
            onClose();
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    return (
        <div className={styles.editContainer}>
            <div className={styles.formContainer}>
                <button type="button" className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2>{t("editCategory.title")}</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t("editCategory.chooseCategory")}</label>
                    <Select
                        options={Object.keys(filters).map((key) => ({
                            value: key,
                            label: t(`categories.${key}`),
                        }))}
                        value={filterName}
                        onChange={(selectedOption) => {
                            setFilterName(selectedOption);
                            setOldName(null);
                            setNewName("");
                        }}
                        placeholder={t("editCategory.selectPlaceholder")}
                    />
                </div>

                {filterName && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("editCategory.selectExisting", { category: filterName.label })}
                        </label>
                        <Select
                            options={filters[filterName.value]?.map((item) => ({
                                value: item,
                                label: item,
                            }))}
                            value={oldName}
                            onChange={(selectedOption) => setOldName(selectedOption)}
                            placeholder={t("editCategory.selectPlaceholderExisting", { category: filterName.label })}
                        />
                    </div>
                )}

                {oldName && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t("editCategory.enterNewName")}</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={t("editCategory.enterNewNamePlaceholder")}
                        />
                    </div>
                )}

                {newName && (
                    <button
                        type="submit"
                        className={styles.button}
                        onClick={handleSubmit}
                    >
                        {t("editCategory.editButton")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default EditCategory;
