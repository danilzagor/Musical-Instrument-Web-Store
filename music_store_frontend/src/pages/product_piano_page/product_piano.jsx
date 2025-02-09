import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import styles from "./product_piano.module.css";
import {AuthContext} from "../../utils/authContext.jsx";
import EditGuitar from "../../components/edit_guitar_component/edit_guitar.jsx";
import EditPiano from "../../components/edit_piano_component/edit_piano.jsx";
import Opinions from "../../components/opinions_component/opinions.jsx";
import {useTranslation} from "react-i18next";

const ProductPiano = () => {
    const {id} = useParams();
    const [piano, setPiano] = useState(null);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pianoResponse = await axiosInstance.get(`/pianos/${id}`);
                const pianoData = pianoResponse.data;
                setPiano(pianoData);
                const isInCartResponse = await axiosInstance.get(`/cart/${pianoData.musical_instrument_id}`);
                if (isInCartResponse.data) {
                    setIsInCart(true);
                }else{
                    setIsInCart(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            const guitarResponse = await axiosInstance.delete(`/pianos/${id}`);
            if (guitarResponse.status === 204) {
                navigate('/pianos')
            } else {
                alert("Error deleting product")
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleEdit = () => {
        setIsEditMode(!isEditMode);
    };

    const handleCart = async () => {
        if (!user) {
            navigate('/login');
        }
        try {
            await axiosInstance.post(`/cart/${piano.musical_instrument_id}`);
        } catch (e) {
            console.error(e);
        }
        window.location.reload();
    }

    if (!piano) return <div>Loading...</div>;

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.productDetails}>
                    <img
                        className={styles.productImage}
                        src={piano.primary_image_url}
                        alt={piano.instrument_name}
                    />
                    <div className={styles.productInfo}>
                        <h2 className={styles.productName}>{piano.instrument_name}</h2>
                        <h3 className={styles.productPrice}>${piano.instrument_price}</h3>
                        {!isInCart ? (
                            <button onClick={handleCart} className={styles.addToCartButton}>
                                {t('product.addToCart')}
                            </button>
                        ) : (
                            <button onClick={() => navigate(`/cart`)} className={styles.addToCartButton}>
                                {t('product.goToCart')}
                            </button>
                        )}

                        {user && user.role === 'ADMIN' && (
                            <div>
                                <button onClick={handleDelete} className={styles.deleteProduct}>
                                    {t('product.deleteProduct')}
                                </button>
                                <button onClick={handleEdit} className={styles.editProduct}>
                                    {t('product.editProduct')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.description}>
                    <h3>{t('product.description')}</h3>
                    <p>{t('product.brand')}: {piano.brand_name}</p>
                    <p>{t('product.color')}: {piano.color_name}</p>
                    <p>{t('product.pedalCount')}: {piano.piano_pedals}</p>
                    <p>{t('product.scale')}: {piano.piano_scale}</p>
                    <p>{t('product.instrumentDescription')}: {piano.instrument_description}</p>
                </div>
                {isEditMode && (
                    <EditPiano pianoData={piano} onClose={() => setIsEditMode(false)} />
                )}
            </div>
            <Opinions musicalInstrumentId={piano.musical_instrument_id} />
        </div>
    );
};

export default ProductPiano;
