const db = require('../config/database');
const azureServices = require('./azureService');

const addMusicInstrument = async (instrument_name, instrument_description, instrument_price, brand_name, color_name, image, connection) => {
    const brandId = await getOrCreateId("brand", brand_name, connection);
    const colorId = await getOrCreateId("color", color_name, connection);

    const query = `
        INSERT INTO musical_instrument (name, description, price, Color_ID, Brand_ID)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
        instrument_name,
        instrument_description,
        instrument_price,
        colorId,
        brandId,
    ]);

    const musicalInstrumentId = result.insertId;
    const url = await azureServices.uploadToBlobStorage(image, musicalInstrumentId);

    await connection.execute(
        `INSERT INTO instrument_images (musical_instrument_id, image_url, is_primary, uploaded_at)
         VALUES (?, ?, ?, ?)`,
        [musicalInstrumentId, url, true, new Date()]
    );

    return musicalInstrumentId;
};

const editMusicInstrument = async (instrument_name, instrument_description, instrument_price, brand_name, color_name, image, id, connection) => {
    const brandId = await getOrCreateId("brand", brand_name, connection);
    const colorId = await getOrCreateId("color", color_name, connection);

    const query = `
        UPDATE musical_instrument SET name=?, description=?, price=?, Color_ID=?, Brand_ID=?
            WHERE id=?
    `;
    await connection.execute(query, [
        instrument_name,
        instrument_description,
        instrument_price,
        colorId,
        brandId,
        id
    ]);



    if(image){
        const [previousImageUrl] = await db.execute(`SELECT instrument_images.image_url FROM instrument_images WHERE musical_instrument_id=?`,[id]);
        if(previousImageUrl.length>0){
            await azureServices.deleteBlobByUrl(previousImageUrl[0].image_url);
            const url = await azureServices.uploadToBlobStorage(image, id);
            await connection.execute(
                `UPDATE instrument_images SET image_url=?, is_primary=?, uploaded_at=? WHERE musical_instrument_id=?`,
                [url, true, new Date(),id]
            );
        }else{
            const url = await azureServices.uploadToBlobStorage(image, id);
            await connection.execute(
                `INSERT INTO instrument_images(musical_instrument_id, image_url, is_primary, uploaded_at) VALUES(?,?,?,?) `,
                [id, url, true, new Date()]
            );
        }

    }

};

const getOrCreateId = async (table, name, connection) => {
    let [rows] = await connection.execute(
        `SELECT id FROM ${table} WHERE LOWER(Name) = LOWER(?)`,
        [name]
    );

    if (rows.length > 0) {
        return rows[0].id;
    }

    const [result] = await connection.execute(
        `INSERT INTO ${table} (Name) VALUES (?)`,
        [name]
    );
    return result.insertId;
};

const editMusicInstrumentFilter = async (filterName, oldName, newName)=>{
    if(filterName==='brands'){
        await db.execute(`UPDATE brand SET Name=? WHERE Name=?`, [newName, oldName]);
    }
    else if(filterName==='colors')
    {
        await db.execute(`UPDATE color SET Name=? WHERE Name=?`, [newName, oldName]);
    }
    else
    {
        throw Error("Filter is not a brand or color");
    }

}


module.exports={
    getOrCreateId,
    addMusicInstrument,
    editMusicInstrument,
    editMusicInstrumentFilter
}