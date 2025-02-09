const reviewService = require('../services/reviewService');


exports.getInstrumentReviews = async (req, res) => {
    try {
        const review = await reviewService.getInstrumentReviews(req.params.musicInstrumentId);
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addInstrumentReview = async (req, res) => {
    const musicInstrumentId = req.params.musicInstrumentId;
    const {title, content, score} = req.body;
    if(!title || !content || !title.length || !score || !content.length) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(score))) {
        return res.status(400).send({ error: "Invalid score. It must be a number." });
    }
    try {
        await reviewService.addInstrumentReview(musicInstrumentId, req.user.id, title, content, score);
        res.status(200).send({message: "Created"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editInstrumentReview = async (req, res) => {
    const musicInstrumentId = req.params.musicInstrumentId;
    const {title, content, score} = req.body;
    if(!title || !content || !title.length || !score || !content.length) {
        return res.status(400).send({ message: "Some fields are missing." });
    }
    if (isNaN(Number(score))) {
        return res.status(400).send({ error: "Invalid score. It must be a number." });
    }
    try {
        await reviewService.editInstrumentReview(musicInstrumentId, req.user.id, title, content, score);
        res.status(200).send({message: "Updated"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteInstrumentReview = async (req, res) => {
    const musicInstrumentId = req.params.musicInstrumentId;
    try {
        await reviewService.deleteInstrumentReview(musicInstrumentId, req.user.id);
        res.status(200).send({message: "Deleted"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsersInstrumentReview = async (req, res) => {
    const musicInstrumentId = req.params.musicInstrumentId;
    try {
        const review = await reviewService.getUsersInstrumentReview(musicInstrumentId, req.user.id);
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};