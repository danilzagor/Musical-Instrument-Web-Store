const db = require('../config/database');

const getUserById = async (id) => {
    const query = 'SELECT * FROM user' +
        ' WHERE user.id = ?';
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
        throw new Error(`User with ID ${id} not found`);
    }
    return rows[0];
}

const editUserById = async (id, name, surname, phone, email) => {
    const query = `UPDATE user SET name=?, surname=?, phone_number=?, email=? WHERE id=?`;
    const [result] = await db.execute(query, [name, surname, phone, email, id]);

    if (result.affectedRows === 0) {
        throw new Error(`User with ID ${id} not found or no changes were made`);
    }
}

module.exports = {
    getUserById,
    editUserById
}