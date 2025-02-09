import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import styles from "./drums.module.css";
import {AuthContext} from "../../utils/authContext.jsx";
import EditCategory from "../../components/edit_category_component/edit_category.jsx";
import {useTranslation} from "react-i18next";

const drums = () => {
    const [drums, setDrums] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        brand: [],
        shellMaterials: [],
        color: [],
    });
    const [colors, setColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [shellMaterials, setShellMaterials] = useState([]);
    const [limit, setLimit] = useState(10);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [editCategories, setEditCategories] = useState(false);
    const {t} = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const drumsResponse = await axiosInstance.get(`/drums?limit=${limit}`);
                setDrums(drumsResponse.data);
                const filtersResponse = await axiosInstance.get('/drums/filters');
                setColors(filtersResponse.data.colors);
                setShellMaterials(filtersResponse.data.shellMaterials);
                setBrands(filtersResponse.data.brands);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [limit]);

    const handleLimitChange = (e) => {
        setLimit(e.target.value);
    };

    const handleFilterChange = (category, value) => {
        setFilters((prevFilters) => {
            const updatedCategory = prevFilters[category].includes(value)
                ? prevFilters[category].filter((item) => item !== value)
                : [...prevFilters[category], value];
            return { ...prevFilters, [category]: updatedCategory };
        });
    };

    const filteredDrums = drums.filter((drum) => {
        const matchesSearch =
            drum.instrument_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = !filters.brand.length || filters.brand.includes(drum.brand_name);
        const matchesModel = !filters.shellMaterials.length || filters.shellMaterials.includes(drum.shell_material_name);
        const matchesColor = !filters.color.length || filters.color.includes(drum.color_name);

        return matchesSearch && matchesBrand && matchesModel && matchesColor;
    });

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <div className={styles.filterSection}>
                    <h3>{t('filters.brand')}</h3>
                    <ul>
                        {brands.map((brand) => (
                            <li key={brand}>
                                <input
                                    type="checkbox"
                                    id={brand}
                                    checked={filters.brand.includes(brand)}
                                    onChange={() => handleFilterChange("brand", brand)}
                                />
                                <label htmlFor={brand}>{brand}</label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.filterSection}>
                    <h3>{t('categories.shell_materials')}</h3>
                    <ul>
                        {shellMaterials.map((shellMaterial) => (
                            <li key={shellMaterial}>
                                <input
                                    type="checkbox"
                                    id={shellMaterial}
                                    checked={filters.shellMaterials.includes(shellMaterial)}
                                    onChange={() => handleFilterChange("shellMaterials", shellMaterial)}
                                />
                                <label htmlFor={shellMaterial}>{shellMaterial}</label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.filterSection}>
                    <h3>{t('filters.color')}</h3>
                    <ul>
                        {colors.map((color) => (
                            <li key={color}>
                                <input
                                    type="checkbox"
                                    id={color}
                                    checked={filters.color.includes(color)}
                                    onChange={() => handleFilterChange("color", color)}
                                />
                                <label htmlFor={color}>{color}</label>
                            </li>
                        ))}
                    </ul>
                </div>
                {user && user.role === 'ADMIN' &&
                    <button className={styles.addButton} onClick={() => setEditCategories(true)}>
                        {t('buttons.editCategories')}
                    </button>
                }
            </div>

            {user && user.role === 'ADMIN' && (editCategories && <EditCategory filterEndpoint={"/drums/filters"} onClose={() => setEditCategories(false)} />)}

            <div className={styles.mainContent}>
                <div className={styles.searchBar}>
                    <input
                        type="search"
                        placeholder={t('search.placeholderDrum')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {user && user.role === 'ADMIN' && (
                    <button className={styles.addButton} onClick={() => navigate('/drums/add')}>
                        {t('buttons.addDrum')}
                    </button>
                )}

                <div className={styles.drumsList}>
                    {filteredDrums.map((drum) => (
                        <Link key={"drum-" + drum.drum_id} to={`/drums/${drum.drum_id}`}>
                            <div className={styles.drumCard}>
                                <img src={drum.primary_image_url} alt={drum.instrument_name} />
                                <h4>{drum.instrument_name}</h4>
                                <h4>{drum.instrument_price}</h4>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.limitDropdown}>
                    <label htmlFor="limit">{t('labels.limit')}</label>
                    <select
                        id="limit"
                        value={limit}
                        onChange={handleLimitChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default drums;
