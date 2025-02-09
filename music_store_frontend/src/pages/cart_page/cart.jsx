import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance.js";
import styles from './Cart.module.css';
import {useTranslation} from "react-i18next";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/cart");
                setCartItems(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleRemoveAll = async () => {
        try{
            await axios.delete("/cart");
            window.location.reload();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await axios.delete(`/cart/${id}`);
            window.location.reload();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className={styles.cartWrapper}>
            <button className={styles.removeAllButton} onClick={handleRemoveAll}>{t('cart.removeAllButton')} </button>
            <div className={styles.cartContainer}>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div className={styles.cartItem} key={"instrument-" + item.musical_instrument_id}>
                            <img src={item.image_url} alt={item.name} className={styles.cartItemImage}/>
                            <div className={styles.cartItemDetails}>
                                <h4 className={styles.cartItemName}>{item.name}</h4>
                                <h4 className={styles.cartItemPrice}>{item.price}</h4>
                                <button className={styles.removeItemButton} onClick={() => handleRemoveItem(item.musical_instrument_id)}>{t('cart.removeItemButton')} </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.emptyCart}>{t('cart.emptyCart')}</p>
                )}
            </div>
        </div>
    );
}

export default Cart;
