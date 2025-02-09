const db = require('../config/database');
const musicInstrumentService = require('./musicInstrumentService');
const azureServices = require('./azureService');

const getAllGuitars = async (limit) => {

    const query = `
        SELECT g.id           AS guitar_id,
               mi.id          AS musical_instrument_id,
               mi.name        AS instrument_name,
               mi.description AS instrument_description,
               mi.price       AS instrument_price,
               b.name         AS brand_name,
               c.name         AS color_name,
               t.name         AS type_name,
               g.scale        AS guitar_scale,
               ii.image_url   AS primary_image_url
        FROM guitar g
                 JOIN musica.musical_instrument mi ON mi.id = g.musical_instrument_id
                 JOIN musica.brand b ON b.id = mi.brand_id
                 JOIN musica.color c ON c.id = mi.color_id
                 JOIN musica.type t ON t.id = g.type_id
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

const getGuitarById = async (id) => {
    const query = `
        SELECT g.id           AS guitar_id,
               mi.id          AS musical_instrument_id,
               mi.name        AS instrument_name,
               mi.description AS instrument_description,
               mi.price       AS instrument_price,
               b.name         AS brand_name,
               c.name         AS color_name,
               t.name         AS type_name,
               g.scale        AS guitar_scale,
               ii.image_url   AS primary_image_url
        FROM guitar g
                 JOIN musica.musical_instrument mi ON mi.id = g.musical_instrument_id
                 JOIN musica.brand b ON b.id = mi.brand_id
                 JOIN musica.color c ON c.id = mi.color_id
                 JOIN musica.type t ON t.id = g.type_id
                 LEFT JOIN musica.instrument_images ii ON ii.musical_instrument_id = mi.id AND ii.is_primary = true
        WHERE g.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
        throw new Error(`Guitar with ID ${id} not found`);
    }

    const guitar = rows[0];
    if (guitar.primary_image_url) {
        guitar.primary_image_url = azureServices.getBlobUrlWithSAS(guitar.primary_image_url);
    }

    return guitar;
};

const getGuitarFilters = async () => {
    const queryColor = `
        SELECT DISTINCT C.name AS 'color_name'
        FROM musical_instrument
                 JOIN Guitar G on musical_instrument.id = G.musical_instrument_id
                 JOIN Color C on C.id = musical_instrument.Color_ID;
    `;

    const queryType = `
        SELECT DISTINCT T.name AS 'type_name'
        FROM musical_instrument
                 JOIN Guitar G on musical_instrument.id = G.musical_instrument_id
                 JOIN Type T on G.type_id = T.id;
    `;

    const queryBrand = `
        SELECT DISTINCT B.Name AS 'brand_name'
        FROM musical_instrument
                 JOIN Guitar G on musical_instrument.id = G.musical_instrument_id
                 JOIN Brand B on B.ID = musical_instrument.Brand_ID;
    `;
    const [rowsColor] = await db.execute(queryColor);
    const [rowsBrand] = await db.execute(queryBrand);
    const [rowsType] = await db.execute(queryType);

    return {
        colors: rowsColor.map(row => row.color_name),
        types: rowsType.map(row => row.type_name),
        brands: rowsBrand.map(row => row.brand_name),
    };
};

const addGuitar = async (instrument_name, instrument_description, instrument_price, brand_name, color_name, type_name, scale, image) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const musicInstrumentId = await musicInstrumentService.addMusicInstrument(
            instrument_name,
            instrument_description,
            instrument_price,
            brand_name,
            color_name,
            image,
            connection
        );

        const typeId = await musicInstrumentService.getOrCreateId("type", type_name, connection);

        const query = `INSERT INTO Guitar (type_id, musical_instrument_id, scale)
                       VALUES (?, ?, ?)`;
        await connection.execute(query, [typeId, musicInstrumentId, scale]);

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

const deleteGuitarById = async (id) => {
    const [rows] = await db.execute(`SELECT musical_instrument.id, image_url
                                     FROM musical_instrument
                                              Join guitar g on musical_instrument.id = g.musical_instrument_id
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

const editGuitarById = async (instrument_name, instrument_description, instrument_price, brand_name, color_name, type_name, scale, image, id) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [rows] = await db.execute(`SELECT musical_instrument.id
                                     FROM musical_instrument
                                              Join guitar g on musical_instrument.id = g.musical_instrument_id
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

        const typeId = await musicInstrumentService.getOrCreateId("type", type_name, connection);

        const query = `UPDATE Guitar SET type_id=?, scale=? WHERE id=?`;
        await connection.execute(query, [typeId, scale, id]);

        await connection.commit();


    } catch (error) {
        console.error("Transaction rolled back:", error);
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

const editGuitarFilterByName = async(filterName, oldName, newName) =>{
    if(filterName==='brands' || filterName==='colors'){
        await musicInstrumentService.editMusicInstrumentFilter(filterName, oldName, newName);
    }else if(filterName==='types'){
        await db.execute(`UPDATE type SET Name=? WHERE Name=?`, [newName, oldName]);
    }else{
        throw Error("Filter is not a brand or color or type");
    }
}

module.exports = {
    getAllGuitars,
    getGuitarById,
    getGuitarFilters,
    addGuitar,
    deleteGuitarById,
    editGuitarById,
    editGuitarFilterByName
};
