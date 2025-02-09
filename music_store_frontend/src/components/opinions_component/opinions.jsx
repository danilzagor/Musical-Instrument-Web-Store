import {useContext, useEffect, useState} from "react";
import styles from "./opinions.module.css";
import axiosInstance from "../../utils/axiosInstance.js";
import {AuthContext} from "../../utils/authContext.jsx";
import {useTranslation} from "react-i18next";

const Opinions = ({musicalInstrumentId}) => {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [createReview, setCreateReview] = useState(false);
    const [editReview, setEditReview] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        score: 0,
    });
    const [error, setError] = useState(null);
    const {user} = useContext(AuthContext);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/reviews/${musicalInstrumentId}`);
                setReviews(response.data);

                if (response.data) {
                    setFormData({
                        title: response.data.opinion_title,
                        content: response.data.opinion_content,
                        score: response.data.opinion_rating,
                    });
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
            try {
                const userReviewResponse = await axiosInstance.get(`/reviews/${musicalInstrumentId}/user`);
                setUserReview(userReviewResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [musicalInstrumentId]);

    const handleCreateReview = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.post(`/reviews/${musicalInstrumentId}`, formData);
            setCreateReview(false);
            setFormData({title: "", content: "", score: 0});
            window.location.reload();
        } catch (err) {
            console.error("Error posting data:", err);
            setError("Failed to post review. Please try again.");
        }
    };

    const handleEditReview = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.put(`/reviews/${musicalInstrumentId}`, formData);
            setEditReview(false);
            setFormData({title: "", content: "", score: 0});
            window.location.reload();
        } catch (err) {
            console.error("Error posting data:", err);
            setError("Failed to post review. Please try again.");
        }
    };

    const handleDeleteReview = async () => {
        try {
            await axiosInstance.delete(`/reviews/${musicalInstrumentId}`);
            setUserReview(null);
            window.location.reload();
        } catch (err) {
            console.error("Error deleting review:", err);
            setError("Failed to delete review. Please try again.");
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{t('opinions.title')}</h3>

            {userReview ? (
                <div>
                    <div className={styles.buttons}>
                        <button className={styles.deleteButton} onClick={handleDeleteReview}>{t('opinions.deleteReview')}</button>
                        <button className={styles.editButton} onClick={() => setEditReview(!editReview)}>
                            {t('opinions.editReview')}
                        </button>
                    </div>
                    <h3 className={styles.userOpinionTitle}>{t('opinions.yourOpinion')}</h3>
                    <h4 className={styles.opinionTitle}>{userReview.opinion_title}</h4>
                    <p className={styles.opinionContent}>{userReview.opinion_content}</p>
                    <p className={styles.opinionScore}>{t('opinions.score')}: {userReview.opinion_rating}</p>
                </div>
            ) : (
                user && (
                    <button className={styles.createReviewButton} onClick={() => setCreateReview(!createReview)}>
                        {createReview ? t('opinions.cancel') : t('opinions.createReview')}
                    </button>
                )
            )}

            {(createReview || editReview) && (
                <div className={styles.reviewForm}>
                    <form onSubmit={editReview ? handleEditReview : handleCreateReview}>
                        <label className={styles.formLabel}>{t('opinions.titleLabel')}</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <label className={styles.formLabel}>{t('opinions.descriptionLabel')}</label>
                        <textarea
                            className={styles.textarea}
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                        <label className={styles.formLabel}>{t('opinions.scoreLabel')}</label>
                        <input
                            className={styles.input}
                            type="number"
                            name="score"
                            min="1"
                            max="5"
                            value={formData.score}
                            onChange={handleChange}
                            required
                        />
                        <button className={styles.submitButton}
                                type="submit">{editReview ? t('opinions.editReviewButton') : t('opinions.postReviewButton')}</button>
                    </form>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </div>
            )}

            <div className={styles.reviewsList}>
                <h3 className={styles.reviewsListTitle}>{t('opinions.otherOpinions')}</h3>
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        if (userReview && review.user_id === userReview.user_id) {
                            return null;
                        }

                        return (
                            <div className={styles.reviewItem} key={review.user_id}>
                                <h4 className={styles.reviewTitle}>{review.opinion_title}</h4>
                                <p className={styles.reviewContent}>{review.opinion_content}</p>
                                <p className={styles.reviewScore}>{t('opinions.score')}: {review.opinion_rating}</p>
                            </div>
                        );
                    })
                ) : (
                    <p className={styles.noReviews}>{t('opinions.noReviews')}</p>
                )}
            </div>
        </div>
    );
};



export default Opinions;
