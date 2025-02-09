const guitarService = require('../services/guitarService');

exports.getAllGuitars = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        if(limit<1) {
            return res.status(400).send({ message: "Limit is less than 1." });
        }
        const guitars = await guitarService.getAllGuitars(limit);
        res.status(200).json(guitars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGuitarById = async (req, res) => {
    try {
        const guitar = await guitarService.getGuitarById(req.params.id);
        res.status(200).json(guitar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGuitarFilters = async (req, res) => {
    try {
        const filters = await guitarService.getGuitarFilters();
        res.status(200).json(filters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addGuitar = async (req, res) => {
    const { instrument_name, instrument_price,instrument_description, brand_name, color_name,scale , type_name } = req.body;
    const image = req.file;

    if (!image || !instrument_name || !instrument_price || !brand_name || !color_name || !type_name || !scale || !instrument_description) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(scale))) {
        return res.status(400).send({ error: "Invalid scale. It must be a number." });
    }
    try {
        const guitar = await guitarService.addGuitar(
            instrument_name,
            instrument_description,
            instrument_price,
            brand_name,
            color_name,
            type_name,
            scale,
            image
        );
        res.status(201).json(guitar);
    } catch (err) {
        console.error("Error adding guitar:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.editGuitarById = async (req, res) => {
    const { instrument_name, instrument_price,instrument_description, brand_name, color_name,scale , type_name } = req.body;
    const image = req.file;

    if (!instrument_name || !instrument_price || !brand_name || !color_name || !type_name || !scale || !instrument_description) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(scale))) {
        return res.status(400).send({ error: "Invalid scale. It must be a number." });
    }
    try {
         await guitarService.editGuitarById(
            instrument_name,
            instrument_description,
            instrument_price,
            brand_name,
            color_name,
            type_name,
            scale,
            image,
            req.params.id
        );
        return res.status(200).send({ message: 'Guitar updated successfully' });
    } catch (err) {
        console.error("Error editing guitar:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

exports.editGuitarFilterByName = async (req, res) => {
    const {filterName, oldName, newName} = req.body;
    if(!filterName || !newName || !newName.length || !oldName || !oldName.length) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    try{
        await guitarService.editGuitarFilterByName(filterName, oldName, newName);
        return res.status(200).send({ message: 'Filter updated successfully' });
    }catch (err){
        console.error("Error editing Filter:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteGuitarById = async (req, res) => {
    try {
        await guitarService.deleteGuitarById(req.params.id);
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


