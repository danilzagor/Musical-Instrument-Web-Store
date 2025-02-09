import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import styles from "./pianos.module.css";
import {AuthContext} from "../../utils/authContext.jsx";
import EditCategory from "../../components/edit_category_component/edit_category.jsx";
import {useTranslation} from "react-i18next";

const pianos = () => {
    const [pianos, setPianos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        brand: [],
        model: [],
        color: [],
    });
    const [colors, setColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [limit, setLimit] = useState(10);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [editCategories, setEditCategories] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pianosResponse = await axiosInstance.get(`/pianos?limit=${limit}`);
                setPianos(pianosResponse.data);
                const filtersResponse = await axiosInstance.get('/pianos/filters');
                setColors(filtersResponse.data.colors);
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

    const filteredPianos = pianos.filter((piano) => {
        const matchesSearch =
            piano.instrument_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = !filters.brand.length || filters.brand.includes(piano.brand_name);
        const matchesColor = !filters.color.length || filters.color.includes(piano.color_name);

        return matchesSearch && matchesBrand && matchesColor;
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

            {user && user.role === 'ADMIN' && (editCategories && <EditCategory filterEndpoint={"/pianos/filters"} onClose={() => setEditCategories(false)} />)}

            <div className={styles.mainContent}>
                <div className={styles.searchBar}>
                    <input
                        type="search"
                        placeholder={t('search.placeholderPiano')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {user && user.role === 'ADMIN' && (
                    <button className={styles.addButton} onClick={() => navigate('/pianos/add')}>
                        {t('buttons.addPiano')}
                    </button>
                )}
                <div className={styles.pianosList}>
                    {filteredPianos.map((piano) => (
                        <Link key={"piano-" + piano.piano_id} to={`/pianos/${piano.piano_id}`}>
                            <div className={styles.pianoCard}>
                                <img src={piano.primary_image_url} alt={piano.instrument_name} />
                                <h4>{piano.instrument_name}</h4>
                                <h4>{piano.instrument_price}</h4>
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

export default pianos;
