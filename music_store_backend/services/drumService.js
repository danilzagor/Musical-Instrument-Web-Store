const db = require('../config/database');
const azureServices = require("./azureService");
const musicInstrumentService = require("./musicInstrumentService");
const guitarService = require("./guitarService");

const getAllDrums = async (limit) => {
    const query = `
        SELECT
            d.id AS drum_id,
            mi.id AS musical_instrument_id,
            mi.name AS instrument_name,
            mi.description AS instrument_description,
            mi.price AS instrument_price,
            b.name AS brand_name,
            c.name AS color_name,
            m.name AS shell_material_name,
            d.floor_tom_number,
            d.tomtom_number,
            ii.image_url AS primary_image_url
        FROM drums d
                 JOIN musica.musical_instrument mi ON mi.id = d.musical_instrument_id
                 JOIN musica.brand b ON b.id = mi.brand_id
                 JOIN musica.color c ON c.id = mi.color_id
                 JOIN musica.shell_material m ON d.shell_material_id = m.id
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

const getDrumById = async (id) => {
    const query = `
        SELECT 
            d.id AS drum_id,
            mi.id AS musical_instrument_id,
            mi.name AS instrument_name,
            mi.description AS instrument_description,
            mi.price AS instrument_price,
            b.name AS brand_name,
            c.name AS color_name,
            m.name AS shell_material_name,
            d.floor_tom_number,
            d.tomtom_number,
            ii.image_url AS primary_image_url
        FROM drums d
        JOIN musica.musical_instrument mi ON mi.id = d.musical_instrument_id
        JOIN musica.brand b ON b.id = mi.brand_id
        JOIN musica.color c ON c.id = mi.color_id
        JOIN musica.shell_material m ON d.shell_material_id = m.id
        LEFT JOIN musica.instrument_images ii ON ii.musical_instrument_id = mi.id AND ii.is_primary = true
        WHERE d.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
        throw new Error(`Drum with ID ${id} not found`);
    }

    const drum = rows[0];
    if (drum.primary_image_url) {
        drum.primary_image_url = azureServices.getBlobUrlWithSAS(drum.primary_image_url);
    }

    return drum;
};

const getDrumFilters = async () => {
    const queryColor = `
        SELECT DISTINCT C.name AS 'color_name'
        FROM musical_instrument
                 JOIN Drums G on musical_instrument.id = G.musical_instrument_id
                 JOIN Color C on C.id = musical_instrument.Color_ID;
    `;

    const queryType = `
        SELECT DISTINCT T.name AS 'type_name'
        FROM musical_instrument
                 JOIN Drums G on musical_instrument.id = G.musical_instrument_id
                 JOIN shell_material T on G.shell_material_id = T.id;
    `;

    const queryBrand = `
        SELECT DISTINCT B.Name AS 'brand_name'
        FROM musical_instrument
                 JOIN Drums G on musical_instrument.id = G.musical_instrument_id
                 JOIN Brand B on B.ID = musical_instrument.Brand_ID;
    `;
    const [rowsColor] = await db.execute(queryColor);
    const [rowsBrand] = await db.execute(queryBrand);
    const [rowsType] = await db.execute(queryType);

    return {
        colors: rowsColor.map(row => row.color_name),
        shellMaterials: rowsType.map(row => row.type_name),
        brands: rowsBrand.map(row => row.brand_name),
    };
};

const addDrum = async (instrument_name, instrument_price,instrument_description, brand_name, color_name,tomtom_number, floor_tom_number, shell_material_name, image) => {
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

        const typeId = await musicInstrumentService.getOrCreateId("shell_material", shell_material_name, connection);

        const query = `INSERT INTO Drums (musical_instrument_id, tomtom_number, floor_tom_number, shell_material_id) VALUES (?, ?, ?, ?)`;
        await connection.execute(query, [musicInstrumentId, tomtom_number, floor_tom_number, typeId]);

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

const deleteDrumById = async (id) => {
    const [rows] = await db.execute(`SELECT musical_instrument.id, image_url
                                     FROM musical_instrument
                                              Join drums g on musical_instrument.id = g.musical_instrument_id
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

const editDrumById = async (instrument_name, instrument_price,instrument_description, brand_name, color_name,tomtom_number, floor_tom_number, shell_material_name, image, id) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [rows] = await db.execute(`SELECT musical_instrument.id
                                     FROM musical_instrument
                                              Join drums g on musical_instrument.id = g.musical_instrument_id
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

        const typeId = await musicInstrumentService.getOrCreateId("shell_material", shell_material_name, connection);

        const query = `UPDATE drums SET tomtom_number=?, floor_tom_number=?, shell_material_id=? WHERE id = ?;`;
        await connection.execute(query, [tomtom_number, floor_tom_number, typeId, id]);

        await connection.commit();


    } catch (error) {
        console.error("Transaction rolled back:", error);
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

const editDrumFilterByName = async(filterName, oldName, newName) =>{
    if(filterName==='brands' || filterName==='colors'){
        await musicInstrumentService.editMusicInstrumentFilter(filterName, oldName, newName);
    }else if(filterName==='shellMaterials'){
        await db.execute(`UPDATE shell_material SET Name=? WHERE Name=?`, [newName, oldName]);
    }else{
        throw Error("Filter is not a brand or color or type");
    }
}

module.exports = {
    getAllDrums,
    getDrumById,
    getDrumFilters,
    addDrum,
    deleteDrumById,
    editDrumById,
    editDrumFilterByName
};
