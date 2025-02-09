const cartService = require('../services/cartService');


exports.addToCart = async (req, res) => {
    const musicInstrumentId = req.params.musicInstrumentId;
    const userId = req.user.id;
    if (!musicInstrumentId) {
        return res.status(400).send('Music Instrument Id is required');
    }
    if (isNaN(Number(musicInstrumentId))) {
        return res.status(400).send({ error: "Invalid ID. It must be a number." });
    }
    try {
        await cartService.addToCart(musicInstrumentId, userId);
        return res.status(200).send('Added successfully');
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.deleteCart = async (req, res) => {
    const userId = req.user.id;
    try {
        await cartService.deleteCart(userId);
        return res.status(200).send('Deleted successfully');
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.deleteFromCart = async (req, res) => {
    const musicInstrumentId = req.params.musicInstrumentId;
    const userId = req.user.id;
    if (!musicInstrumentId) {
        return res.status(400).send('Music Instrument Id is required');
    }
    if (isNaN(Number(musicInstrumentId))) {
        return res.status(400).send({ error: "Invalid ID. It must be a number." });
    }
    try {
        await cartService.deleteFromCart(musicInstrumentId, userId);
        return res.status(200).send('Deleted successfully');
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const instruments = await cartService.getCart(userId);
        return res.status(200).json(instruments);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.getInstrumentInCart = async (req, res) => {
    const musicInstrumentId = req.params.musicInstrumentId;
    const userId = req.user.id;

    if (!musicInstrumentId) {
        return res.status(400).send('Music Instrument Id is required');
    }
    if (isNaN(Number(musicInstrumentId))) {
        return res.status(400).send({ error: "Invalid ID. It must be a number." });
    }

    try {
        const instrument = await cartService.getInstrumentInCart(musicInstrumentId, userId);

        if (!instrument) {
            return res.status(404).send('Instrument not found in the cart');
        }

        return res.status(200).json(instrument);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};