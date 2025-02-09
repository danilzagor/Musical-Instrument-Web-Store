import {useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import styles from './home.module.css';
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Home = () => {

    const [guitars, setGuitars] = useState([]);
    const [drums, setDrums] = useState([]);
    const [pianos, setPianos] = useState([]);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const guitarsResponse = await axiosInstance.get('/guitars?limit=3`);');
                setGuitars(guitarsResponse.data);
                const drumsResponse = await axiosInstance.get('/drums?limit=3');
                setDrums(drumsResponse.data);
                const pianosResponse = await axiosInstance.get('/pianos?limit=3');
                setPianos(pianosResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.content}>
            <h1>{t('instruments.interest')}</h1>

            <h2>{t('types.guitars')}</h2>
            <div className={styles.guitars}>
                {
                    guitars &&
                    guitars.map(guitar => (
                        <Link key={"guitar-" + guitar.guitar_id} to={`/guitars/${guitar.guitar_id}`}>
                            <div className={styles.guitar} key={"guitar-" + guitar.guitar_id}>
                                <img src={guitar.primary_image_url} alt={guitar.instrument_name} />
                                <h4>{guitar.instrument_name}</h4>
                                <h4>{guitar.instrument_price}</h4>
                            </div>
                        </Link>
                    ))
                }
            </div>

            <h2>{t('types.drums')}</h2>
            <div className={styles.drums}>
                {
                    drums &&
                    drums.map(drum => (
                        <Link key={"drum-" + drum.drum_id} to={`/drums/${drum.drum_id}`}>
                            <div className={styles.drum} key={"drum-" + drum.drum_id}>
                                <img src={drum.primary_image_url} alt={drum.instrument_name} />
                                <h4>{drum.instrument_name}</h4>
                                <h4>{drum.instrument_price}</h4>
                            </div>
                        </Link>
                    ))
                }
            </div>

            <h2>{t('types.pianos')}</h2>
            <div className={styles.pianos}>
                {
                    pianos &&
                    pianos.map(piano => (
                        <Link key={"piano-" + piano.piano_id} to={`/pianos/${piano.piano_id}`}>
                            <div className={styles.piano} key={"piano-" + piano.piano_id}>
                                <img src={piano.primary_image_url} alt={piano.instrument_name} />
                                <h4>{piano.instrument_name}</h4>
                                <h4>{piano.instrument_price}</h4>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}

export default Home;