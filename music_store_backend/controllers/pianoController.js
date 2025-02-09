const pianoService = require('../services/pianoService');

exports.getAllPianos = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        if(limit<1) {
            return res.status(400).send({ message: "Limit is less than 1." });
        }
        const pianos = await pianoService.getAllPianos(limit);
        res.status(200).json(pianos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPianosById = async (req, res) => {
    try {
        const piano = await pianoService.getPianoById(req.params.id);
        res.status(200).json(piano);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPianoFilters = async (req, res) => {
    try {
        const filters = await pianoService.getPianoFilters();
        res.status(200).json(filters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addPiano = async (req, res) => {
    const { instrument_name, instrument_price,instrument_description, brand_name, color_name, piano_scale, piano_pedals} = req.body;
    const image = req.file;

    if (!image || !instrument_name || !instrument_price || !brand_name || !color_name || !piano_scale || !piano_pedals || !instrument_description) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(piano_scale))) {
        return res.status(400).send({ error: "Invalid scale. It must be a number." });
    }
    try {
        const piano = await pianoService.addPiano(
            instrument_name,
            instrument_description,
            instrument_price,
            brand_name,
            color_name,
            piano_scale,
            piano_pedals,
            image
        );
        res.status(201).json(piano);
    } catch (err) {
        console.error("Error adding piano:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.editPianoById = async (req, res) => {
    const { instrument_name, instrument_price,instrument_description, brand_name, color_name, piano_scale, piano_pedals} = req.body;
    const image = req.file;

    if (!instrument_name || !instrument_price || !brand_name || !color_name || !piano_scale || !piano_pedals || !instrument_description) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(piano_scale))) {
        return res.status(400).send({ error: "Invalid scale. It must be a number." });
    }
    try {
        await pianoService.editPianoById(
            instrument_name,
            instrument_price,
            instrument_description,
            brand_name,
            color_name,
            piano_scale,
            piano_pedals,
            image,
            req.params.id
        );
        return res.status(200).send({ message: 'Piano updated successfully' });
    } catch (err) {
        console.error("Error adding piano:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.editPianoFilterByName = async (req, res) => {
    const {filterName, oldName, newName} = req.body;
    if(!filterName || !newName || !newName.length || !oldName || !oldName.length) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    try{
        await pianoService.editPianoFilterByName(filterName, oldName, newName);
        return res.status(200).send({ message: 'Filter updated successfully' });
    }catch (err){
        console.error("Error editing Filter:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

exports.deletePianoById = async (req, res) => {
    try {
        await pianoService.deletePianoById(req.params.id);
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
