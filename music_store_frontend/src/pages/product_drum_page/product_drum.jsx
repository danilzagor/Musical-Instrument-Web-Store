import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import styles from "./product_drum.module.css";
import {AuthContext} from "../../utils/authContext.jsx";
import EditDrum from "../../components/edit_drum_component/edit_drum.jsx";
import Opinions from "../../components/opinions_component/opinions.jsx";
import {useTranslation} from "react-i18next";

const ProductDrum = () => {
    const {id} = useParams();
    const [drum, setDrum] = useState(null);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const drumResponse = await axiosInstance.get(`/drums/${id}`);
                const drumData = drumResponse.data;
                setDrum(drumData);
                const isInCartResponse = await axiosInstance.get(`/cart/${drumData.musical_instrument_id}`);
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
            const guitarResponse = await axiosInstance.delete(`/drums/${id}`);
            if (guitarResponse.status === 204) {
                navigate('/drums')
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
            await axiosInstance.post(`/cart/${drum.musical_instrument_id}`);
        } catch (e) {
            console.error(e);
        }
        window.location.reload();
    }


    if (!drum) return <div>Loading...</div>;

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.productDetails}>
                    <img
                        className={styles.productImage}
                        src={drum.primary_image_url}
                        alt={drum.instrument_name}
                    />
                    <div className={styles.productInfo}>
                        <h2 className={styles.productName}>{drum.instrument_name}</h2>
                        <h3 className={styles.productPrice}>${drum.instrument_price}</h3>
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
                {isEditMode && (
                    <EditDrum drumData={drum} onClose={() => setIsEditMode(false)} />
                )}
                <div className={styles.description}>
                    <h3>{t('product.description')}</h3>
                    <p>{t('product.brand')}: {drum.brand_name}</p>
                    <p>{t('product.color')}: {drum.color_name}</p>
                    <p>{t('product.shellMaterial')}: {drum.shell_material_name}</p>
                    <p>{t('product.tomtoms')}: {drum.tomtom_number}</p>
                    <p>{t('product.floorTomtoms')}: {drum.floor_tom_number}</p>
                    <p>{t('product.instrumentDescription')}: {drum.instrument_description}</p>
                </div>
            </div>
            <Opinions musicalInstrumentId={drum.musical_instrument_id} />
        </div>
    );
};

export default ProductDrum;
