const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const generateToken = (user) => {
    return jwt.sign(
        { id: user.user_id, username: user.login, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const login = async (login, password) => {
    const query = `SELECT * FROM users_credentials WHERE login = ?;`;
    const [rows] = await db.execute(query, [login]);
    if (rows.length === 0) {
        throw new Error('Invalid username or password');
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid username or password');
    }

    return generateToken(user);
}

const register = async (login, password, name, surname, email) => {
    const query = `SELECT * FROM users_credentials WHERE login = ?;`;
    const [rows] = await db.execute(query, [login]);
    if (rows.length !== 0) {
        throw new Error('Login is already taken');
    }
    const [emailExistRows] = await db.execute(`SELECT * FROM user WHERE email = ?;` ,[email]);
    if (emailExistRows.length !== 0) {
        throw new Error('Email is already taken');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.execute(`INSERT INTO user(name, surname, email) VALUES (?,?,?)` ,[name, surname, email]);

    const queryRegister = `INSERT INTO users_credentials (user_id,login, password, role) VALUES (?, ?, ?,'USER')`;
    await db.execute(queryRegister, [user.insertId ,login, hashedPassword]);


}

module.exports = {
    login,
    register
}
