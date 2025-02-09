import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import styles from "./product_guitar.module.css";
import {AuthContext} from "../../utils/authContext.jsx";
import EditGuitar from "../../components/edit_guitar_component/edit_guitar.jsx";
import Opinions from "../../components/opinions_component/opinions.jsx";
import {useTranslation} from "react-i18next";

const ProductGuitar = () => {
    const {id} = useParams();
    const [guitar, setGuitar] = useState(null);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const {t} = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const guitarResponse = await axiosInstance.get(`/guitars/${id}`);
                const guitarData = guitarResponse.data;
                setGuitar(guitarData);
                const isInCartResponse = await axiosInstance.get(`/cart/${guitarData.musical_instrument_id}`);
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
            const guitarResponse = await axiosInstance.delete(`/guitars/${id}`);
            if (guitarResponse.status === 204) {
                navigate('/guitars')
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
            await axiosInstance.post(`/cart/${guitar.musical_instrument_id}`);
            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    if (!guitar) return <div>Loading...</div>;

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.productDetails}>
                    <img
                        className={styles.productImage}
                        src={guitar.primary_image_url}
                        alt={guitar.instrument_name}
                    />
                    <div className={styles.productInfo}>
                        <h2 className={styles.productName}>{guitar.instrument_name}</h2>
                        <h3 className={styles.productPrice}>${guitar.instrument_price}</h3>
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
                    <p>{t('product.brand')}: {guitar.brand_name}</p>
                    <p>{t('product.color')}: {guitar.color_name}</p>
                    <p>{t('product.type')}: {guitar.type_name}</p>
                    <p>{t('product.scale')}: {guitar.guitar_scale}</p>
                    <p>{t('product.instrumentDescription')}: {guitar.instrument_description}</p>
                </div>
                {isEditMode && (
                    <EditGuitar guitarData={guitar} onClose={() => setIsEditMode(false)} />
                )}
            </div>
            <Opinions musicalInstrumentId={guitar.musical_instrument_id} />
        </div>
    );
};

export default ProductGuitar;
