const userService = require('../services/userService');


exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editUserById = async (req, res) => {
    const id = req.params.id;
    const {name, surname, phone, email} = req.body;
    if(!name || !surname || !phone || !email || !id) {
        return res.status(400).send({ message: "Some field are missing!" });
    }
    try {
        await userService.editUserById(id, name, surname, phone, email);
        res.status(200).send({ message: "User updated successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
