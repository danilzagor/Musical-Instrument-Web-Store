const db = require('../config/database');

const getInstrumentReviews = async (id) => {
    const query = `
        SELECT 
            opinion.title AS opinion_title,
            opinion.score AS opinion_rating,
            opinion.content AS opinion_content,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email
        FROM opinion
        JOIN musica.user u ON u.id = opinion.user_id
        WHERE opinion.musical_instrument_id = ?;
    `;
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
        throw new Error(`No reviews found for musical instrument with ID ${id}`);
    }
    return rows;
}

const addInstrumentReview = async (musicInstrumentId, userId, title, content, score) => {
    const [reviews] = await db.execute(`SELECT * FROM opinion WHERE musical_instrument_id=? AND user_id=?`, [musicInstrumentId, userId]);
    if(reviews.length>0){
        throw new Error(`This instrument has already a review from this user`);
    }

    const query = `
        INSERT INTO opinion VALUES (?,?,?,?,?)
    `;
    await db.execute(query, [userId, musicInstrumentId, title, content, score]);
}

const editInstrumentReview = async (musicInstrumentId, userId, title, content, score) => {
    const [reviews] = await db.execute(`SELECT * FROM opinion WHERE musical_instrument_id=? AND user_id=?`, [musicInstrumentId, userId]);
    if(reviews.length===0){
        throw new Error(`This instrument doesnt have a review from this user`);
    }

    const query = `
        UPDATE opinion SET title=?, content=?, score=? WHERE user_id=? AND musical_instrument_id=?
    `;
    await db.execute(query, [title, content, score, userId, musicInstrumentId]);
}

const deleteInstrumentReview = async (musicInstrumentId, userId) => {
    const [reviews] = await db.execute(`SELECT * FROM opinion WHERE musical_instrument_id=? AND user_id=?`, [musicInstrumentId, userId]);
    if(reviews.length===0){
        throw new Error(`This instrument doesnt have a review from this user`);
    }

    const query = `
        DELETE FROM opinion WHERE user_id=? AND musical_instrument_id=?
    `;
    await db.execute(query, [userId, musicInstrumentId]);
}

const getUsersInstrumentReview = async (musicInstrumentId, userId) => {
    const query = `
        SELECT 
            opinion.title AS opinion_title,
            opinion.score AS opinion_rating,
            opinion.content AS opinion_content,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email
        FROM opinion
        JOIN musica.user u ON u.id = opinion.user_id
        WHERE opinion.musical_instrument_id = ?
        AND opinion.user_id=?;
    `;
    const [rows] = await db.execute(query, [musicInstrumentId, userId]);
    if (rows.length === 0) {
        throw new Error(`No reviews found for musical instrument`);
    }
    return rows[0];
}

module.exports = {
    getInstrumentReviews,
    addInstrumentReview,
    editInstrumentReview,
    deleteInstrumentReview,
    getUsersInstrumentReview
};
