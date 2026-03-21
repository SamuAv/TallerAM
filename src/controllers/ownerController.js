const db = require('../config/db');

// GET /owners — lista todos los dueños
exports.getAllOwners = (req, res) => {
    db.all('SELECT * FROM owners ORDER BY name ASC', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('owners/index', { title: 'Dueños', owners: rows });
    });
};

// GET /owners/create — formulario para agregar dueño
exports.getCreateForm = (req, res) => {
    res.render('owners/create', { title: 'Nuevo Dueño', error: null });
};

// POST /owners/create — crear dueño
exports.createOwner = (req, res) => {
    const { name, phone, email } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).render('owners/create', {
            title: 'Nuevo Dueño',
            error: 'El nombre del dueño es obligatorio.'
        });
    }

    const sql = 'INSERT INTO owners (name, phone, email) VALUES (?, ?, ?)';
    db.run(sql, [name.trim(), phone, email], function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/owners');
    });
};
