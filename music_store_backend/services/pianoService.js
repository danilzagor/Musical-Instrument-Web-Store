const db = require('../config/database');
const azureServices = require("./azureService");
const musicInstrumentService = require("./musicInstrumentService");

const getAllPianos = async (limit) => {
    const query = `
        SELECT 
            p.id AS piano_id,
            mi.id AS musical_instrument_id,
            mi.name AS instrument_name,
            mi.description AS instrument_description,
            mi.price AS instrument_price,
            b.name AS brand_name,
            c.name AS color_name,
            p.scale AS piano_scale,
            p.Pedals AS piano_pedals,
            ii.image_url AS primary_image_url
        FROM piano p
        JOIN musica.musical_instrument mi ON mi.id = p.musical_instrument_id
        JOIN musica.brand b ON b.id = mi.brand_id
        JOIN musica.color c ON c.id = mi.color_id
        LEFT JOIN musica.instrument_images ii ON ii.musical_instrument_id = mi.id AND ii.is_primary = true
        LIMIT ${limit} 
    `;
    const [rows] = await db.execute(query);

    rows.forEach((row) => {
        if (row.primary_image_url) {
            row.primary_image_url = azureServices.getBlobUrlWithSAS(row.primary_image_url);
        }
    });

    return rows;
};

const getPianoById = async (id) => {
    const query = `
        SELECT 
            p.id AS piano_id,
            mi.id AS musical_instrument_id,
            mi.name AS instrument_name,
            mi.description AS instrument_description,
            mi.price AS instrument_price,
            b.name AS brand_name,
            c.name AS color_name,
            p.scale AS piano_scale,
            p.Pedals AS piano_pedals,
            ii.image_url AS primary_image_url
        FROM piano p
        JOIN musica.musical_instrument mi ON mi.id = p.musical_instrument_id
        JOIN musica.brand b ON b.id = mi.brand_id
        JOIN musica.color c ON c.id = mi.color_id
        LEFT JOIN musica.instrument_images ii ON ii.musical_instrument_id = mi.id AND ii.is_primary = true
        WHERE p.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
        throw new Error(`Piano with ID ${id} not found`);
    }

    const piano = rows[0];
    if (piano.primary_image_url) {
        piano.primary_image_url = azureServices.getBlobUrlWithSAS(piano.primary_image_url);
    }

    return piano;
};

const getPianoFilters = async () => {
    const queryColor = `
        SELECT DISTINCT C.name AS 'color_name'
        FROM musical_instrument
                 JOIN piano G on musical_instrument.id = G.musical_instrument_id
                 JOIN Color C on C.id = musical_instrument.Color_ID;
    `;

    const queryBrand = `
        SELECT DISTINCT B.Name AS 'brand_name'
        FROM musical_instrument
                 JOIN piano G on musical_instrument.id = G.musical_instrument_id
                 JOIN Brand B on B.ID = musical_instrument.Brand_ID;
    `;
    const [rowsColor] = await db.execute(queryColor);
    const [rowsBrand] = await db.execute(queryBrand);

    return {
        colors: rowsColor.map(row => row.color_name),
        brands: rowsBrand.map(row => row.brand_name),
    };
};

const addPiano = async (instrument_name, instrument_price,instrument_description, brand_name, color_name, piano_scale, piano_pedals, image) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const musicInstrumentId = await musicInstrumentService.addMusicInstrument(
            instrument_name,
            instrument_price,
            instrument_description,
            brand_name,
            color_name,
            image,
            connection
        );

        const query = `INSERT INTO piano (musical_instrument_id, scale, Pedals) VALUES (?, ?, ?)`;
        await connection.execute(query, [musicInstrumentId, piano_scale, piano_pedals]);

        await connection.commit();

        return musicInstrumentId;

    } catch (error) {
        console.error("Transaction rolled back:", error);
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const deletePianoById = async (id) => {
    const [rows] = await db.execute(`SELECT musical_instrument.id, image_url
                                     FROM musical_instrument
                                              Join piano g on musical_instrument.id = g.musical_instrument_id
                                              JOIN instrument_images ii
                                                   on g.musical_instrument_id = ii.musical_instrument_id
                                     WHERE g.id = ?
    `, [id]);
    try{
        await azureServices.deleteBlobByUrl(rows[0].image_url);
    }catch (error) {
        console.log(error);
    }

    const query = `DELETE
                   FROM musical_instrument
                   WHERE id = ?;`;
    await db.execute(query, [rows[0].id]);
}

const editPianoById = async (instrument_name, instrument_price,instrument_description, brand_name, color_name, piano_scale, piano_pedals, image, id) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [rows] = await db.execute(`SELECT musical_instrument.id
                                     FROM musical_instrument
                                              Join piano g on musical_instrument.id = g.musical_instrument_id
                                     WHERE g.id = ?
    `, [id]);
        await musicInstrumentService.editMusicInstrument(
            instrument_name,
            instrument_description,
            instrument_price,
            brand_name,
            color_name,
            image,
            rows[0].id,
            connection
        );

        const query = `UPDATE piano SET Pedals=?, scale=? WHERE id = ?;`;
        await connection.execute(query, [piano_pedals, piano_scale, id]);

        await connection.commit();


    } catch (error) {
        console.error("Transaction rolled back:", error);
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

const editPianoFilterByName = async(filterName, oldName, newName) =>{
    if(filterName==='brands' || filterName==='colors'){
        await musicInstrumentService.editMusicInstrumentFilter(filterName, oldName, newName);
    }else{
        throw Error("Filter is not a brand or color or type");
    }
}

module.exports = {
    getAllPianos,
    getPianoById,
    getPianoFilters,
    addPiano,
    deletePianoById,
    editPianoById,
    editPianoFilterByName
};
