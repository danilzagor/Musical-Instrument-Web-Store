const authService = require('../services/authService');

exports.login = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).send('Username and password are required');
    }
    try {
        const token = await authService.login(login, password);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });
        return res.status(200).send('Logged in');
    }
    catch (error) {
        return res.status(401).send(error.message);
    }

}

exports.logout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1,
        });
        return res.status(200).send('Logged out');
    }
    catch (error) {
        return res.status(401).send(error.message);
    }

}

exports.register = async (req, res) => {
    const { login, password, name, surname, email } = req.body;
    if (!login || !password || !name || !surname || !email) {
        return res.status(400).send('All fields are required');
    }

    try {
        await authService.register(login, password, name, surname, email);
        return res.status(200).send('Registered successfully');
    } catch (error) {
        return res.status(401).send(error.message);
    }
};

exports.verify = async (req, res) => {
    res.json({ user: { id: req.user.id, username: req.user.username, role: req.user.role } });
}