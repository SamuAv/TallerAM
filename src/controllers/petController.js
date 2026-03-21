const db = require('../config/db');

// GET /pets — lista mascotas con el nombre del dueño (JOIN)
exports.getAllPets = (req, res) => {
    const sql = `
        SELECT pets.*, owners.name AS owner_name
        FROM   pets
        JOIN   owners ON pets.owner_id = owners.id
        ORDER  BY pets.name ASC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('pets/index', { title: 'Mascotas', pets: rows });
    });
};

// GET /pets/create — formulario para agregar mascota
exports.getCreateForm = (req, res) => {
    db.all('SELECT * FROM owners ORDER BY name ASC', [], (err, owners) => {
        if (err) return res.status(500).send(err.message);
        res.render('pets/create', { title: 'Nueva Mascota', owners, error: null });
    });
};

// POST /pets/create — crear mascota con validación de dueño (Criterio 2)
exports.createPet = (req, res) => {
    const { name, species, breed, owner_id } = req.body;

    // Validar campos básicos
    if (!name || name.trim() === '' || !owner_id) {
        db.all('SELECT * FROM owners ORDER BY name ASC', [], (err, owners) => {
            res.status(400).render('pets/create', {
                title: 'Nueva Mascota',
                owners: owners || [],
                error: 'El nombre de la mascota y el dueño son obligatorios.'
            });
        });
        return;
    }

    // Criterio 2: verificar que el dueño exista en la BD antes de insertar
    db.get('SELECT id FROM owners WHERE id = ?', [owner_id], (err, owner) => {
        if (err) return res.status(500).send(err.message);

        if (!owner) {
            db.all('SELECT * FROM owners ORDER BY name ASC', [], (err2, owners) => {
                res.status(400).render('pets/create', {
                    title: 'Nueva Mascota',
                    owners: owners || [],
                    error: 'El dueño seleccionado no existe. Registre primero al dueño.'
                });
            });
            return;
        }

        const sql = 'INSERT INTO pets (name, species, breed, owner_id) VALUES (?, ?, ?, ?)';
        db.run(sql, [name.trim(), species || 'Perro', breed, owner_id], function (err3) {
            if (err3) return res.status(500).send(err3.message);
            res.redirect('/pets');
        });
    });
};
