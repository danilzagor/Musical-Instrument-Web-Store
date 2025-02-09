const drumService = require('../services/drumService');

exports.getAllDrums = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        if(limit<1) {
            return res.status(400).send({ message: "Limit is less than 1." });
        }
        const drums = await drumService.getAllDrums(limit);
        res.status(200).json(drums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDrumById = async (req, res) => {
    try {
        const drum = await drumService.getDrumById(req.params.id);
        res.status(200).json(drum);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDrumFilters = async (req, res) => {
    try {
        const filters = await drumService.getDrumFilters();
        res.status(200).json(filters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addDrum = async (req, res) => {
    const { instrument_name, instrument_price,instrument_description, brand_name, color_name,tomtom_number, floor_tom_number, shell_material_name} = req.body;
    const image = req.file;

    if (!image || !instrument_name || !instrument_price || !brand_name || !color_name || !tomtom_number || !floor_tom_number || !shell_material_name || !instrument_description) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(tomtom_number))) {
        return res.status(400).send({ error: "Invalid tomtom_number. It must be a number." });
    }
    if (isNaN(Number(floor_tom_number))) {
        return res.status(400).send({ error: "Invalid floor_tom_number. It must be a number." });
    }

    try {
        const drum = await drumService.addDrum(
            instrument_name,
            instrument_price,
            instrument_description,
            brand_name,
            color_name,
            tomtom_number,
            floor_tom_number,
            shell_material_name,
            image
        );
        res.status(201).json(drum);
    } catch (err) {
        console.error("Error adding drum:", err.message);
        res.status(500).json({ error: err.message });
    }
};


exports.editDrumById = async (req, res) => {
    const { instrument_name, instrument_price,instrument_description, brand_name, color_name,tomtom_number, floor_tom_number, shell_material_name} = req.body;
    const image = req.file;

    if (!instrument_name || !instrument_price || !brand_name || !color_name || !tomtom_number || !floor_tom_number || !shell_material_name || !instrument_description) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(tomtom_number))) {
        return res.status(400).send({ error: "Invalid tomtom_number. It must be a number." });
    }
    if (isNaN(Number(floor_tom_number))) {
        return res.status(400).send({ error: "Invalid floor_tom_number. It must be a number." });
    }

    try {
        await drumService.editDrumById(
            instrument_name,
            instrument_price,
            instrument_description,
            brand_name,
            color_name,
            tomtom_number,
            floor_tom_number,
            shell_material_name,
            image,
            req.params.id
        );
        return res.status(200).send({ message: 'Drum updated successfully' });
    } catch (err) {
        console.error("Error adding drum:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.editDrumFilterByName = async (req, res) => {
    const {filterName, oldName, newName} = req.body;
    if(!filterName || !newName || !newName.length || !oldName || !oldName.length) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    try{
        await drumService.editDrumFilterByName(filterName, oldName, newName);
        return res.status(200).send({ message: 'Filter updated successfully' });
    }catch (err){
        console.error("Error editing Filter:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

exports.deleteDrumById = async (req, res) => {
    try {
        await drumService.deleteDrumById(req.params.id);
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

