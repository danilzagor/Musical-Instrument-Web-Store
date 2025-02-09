const db = require('../config/database');
const azureServices = require("./azureService");

const addToCart = async (musicInstrumentId, userId) =>{
    const [rows] = await db.execute(`SELECT * FROM cart WHERE Musical_Instrument_id=? AND User_id = ? `, [musicInstrumentId, userId]);
    if(rows.length > 0){
        throw new Error("Cart already has this musical instrument in it!");
    }
    await db.execute(`INSERT INTO cart(Musical_Instrument_id, User_id) VALUES(?,?)`, [musicInstrumentId, userId]);
}

const getCart = async (userId) =>{
    const [result] = await db.execute(`SELECT ii.musical_instrument_id, name, price, image_url
                             FROM cart
                                      LEFT JOIN musica.musical_instrument mi on cart.Musical_Instrument_id = mi.id
                                      LEFT JOIN musica.instrument_images ii on mi.id = ii.musical_instrument_id
                             WHERE User_id = ? `, [userId]);

    result.forEach((row) => {
        if (row.image_url) {
            row.image_url = azureServices.getBlobUrlWithSAS(row.image_url);
        }
    });

    return result;
}

const deleteFromCart = async (musicInstrumentId, userId) =>{
    await db.execute(`DELETE FROM cart WHERE Musical_Instrument_id=? AND User_id = ? `, [musicInstrumentId, userId]);
}

const deleteCart = async (userId) =>{
    await db.execute(`DELETE FROM cart WHERE User_id=?`, [userId]);
}
const getInstrumentInCart = async (musicInstrumentId, userId) =>{
    const [result] = await db.execute(`SELECT ii.musical_instrument_id, name, price, image_url
                             FROM cart
                                      LEFT JOIN musica.musical_instrument mi on cart.Musical_Instrument_id = mi.id
                                      LEFT JOIN musica.instrument_images ii on mi.id = ii.musical_instrument_id
                             WHERE User_id = ? AND cart.Musical_Instrument_id=? `, [userId,musicInstrumentId]);
    const item = result[0];
    if (item.image_url) {
        item.image_url = azureServices.getBlobUrlWithSAS(item.image_url);
    }
    return item;
}

module.exports = {
    addToCart,
    getCart,
    deleteFromCart,
    deleteCart,
    getInstrumentInCart
}